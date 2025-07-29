from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for now
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("options/{ticker}")
def get_options(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        expiries = stock.options
        
        #We only return options with expiries less than 14 days
        expiries= [datetime.strptime(d, "%Y-%m-%d") for d in expiries]
        today = datetime.today()
        filtered_expiries = [d.strftime("%Y-%m-%d") for d in expiries if ((abs(d - today).days) <= 14 and (abs(d - today).days) >= 7)]

        all_options = pd.DataFrame()

        for expiry in filtered_expiries:
            option_chain = stock.option_chain(expiry)
            ##handle calls
            calls = option_chain.calls
            calls = calls[calls["inTheMoney"] == False]
            calls['optionType'] = "CE"
            calls["expiry"] = expiry
            calls["dte"] = (datetime.strptime(expiry, "%Y-%m-%d")-today).days
            all_options = pd.concat([calls, all_options])
  
            puts = option_chain.puts
            puts = puts[puts["inTheMoney"] == False]
            puts['optionType'] = "PE"
            puts["expiry"] = expiry
            puts["dte"] = (datetime.strptime(expiry, "%Y-%m-%d")-today).days
            all_options = pd.concat([puts, all_options])

        all_options = all_options.reset_index(drop=True)
        all_options["ticker"] = ticker 
        all_options["roi"] = round(all_options["lastPrice"]/all_options["strike"], 4)

        all_options = all_options[["ticker", "optionType", "strike", "expiry", "dte", "lastPrice", "roi"]]
        all_options.columns = ["ticker", "optionType", "strikePrice", "expiryDate", "DTE", "premium", "roi"]

        return all_options.to_dict(orient='records')
    
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/expiry_and_strikes/{ticker}/{strategy}")
def get_expiries_and_strikes(ticker: str, strategy: str):
    try:
        stock = yf.Ticker(ticker)
        expiries = stock.options
        ltp = stock.fast_info['last_price']
        
        #We only return options with expiries less than 14 days
        expiries= [datetime.strptime(d, "%Y-%m-%d") for d in expiries]
        expiries = [d.strftime("%Y-%m-%d") for d in expiries]
        expiries = expiries[:4]

        all_strikes = set()

        for expiry in expiries:
            option_chain = stock.option_chain(expiry)
            ##handle calls
            if strategy.lower() == "ratio call spread":
                strikes = option_chain.calls[option_chain.calls["inTheMoney"] == False]['strike'].tolist()
                all_strikes.update(strikes)
                sorted_strikes = sorted(all_strikes)
            
            if strategy.lower() == "ratio put spread":
                strikes = option_chain.puts[option_chain.puts["inTheMoney"] == False]['strike'].tolist()
                all_strikes.update(strikes)
                sorted_strikes = sorted(all_strikes, reverse = True)
        
        for i in range(len(sorted_strikes)):
            sorted_strikes[i] = str(sorted_strikes[i]) +" | " + str(round(((abs(sorted_strikes[i] - ltp)*100)/ltp),2)) + "% away"

        ####Calculating weekly volatilities

        df = yf.download(ticker, period="60d", interval="1d")
        df.columns = [col[0] for col in df.columns]
        df = df[['Open', 'High', 'Low']].dropna()
        df["start_date"] = df.index
        df["end_date"] = df.index

        # Resample weekly (ending Sunday)
        weekly = df.resample('W').agg({
            'Open': 'first',
            'High': 'max',
            'Low': 'min',
            'start_date': 'min',
            'end_date': 'max'
        })

        weekly['trading_days'] = df.resample('W').size()
        weekly = weekly[weekly['trading_days'] >= 4]
        weekly['percent_range'] = (weekly['High'] - weekly['Low']) / weekly['Open'] * 100

        weekly_vol = []

        for _, row in weekly.tail(4).iterrows():
            start = row["start_date"].strftime("%d %b %Y")
            end = row["end_date"].strftime("%d %b %Y")
            weekly_vol.append(f"{start} - {end}: {row['percent_range']:.2f}%")

        return {
            "expiries": expiries,
            "strikes": sorted_strikes,
            "weeklyVol": weekly_vol
        }
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/candles/{ticker}")
def getCandles(ticker: str):
    data = yf.download(ticker.upper(), period="1y", interval="1d")

    data.columns = [col[0] for col in data.columns]
    data = data.sort_values(by='Date')

    candles = []

    for idx, row in data.iterrows():
        time_unix = int(idx.timestamp())
        candles.append({
            "time": int(time_unix),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
        })

    return candles


"""
This function is used to fetch option legs for the ratio call spread strategy
We return two option legs, one for buy and one for sell
Buy leg with the ask price as premium(because we buy at ask price) and three strike price lesser than the sellLeg
Sell leg with the bid price as premium(because we sell at the bid price) and strike price is provided by the user which he thinks stock won't cross
Lot size is returned as 1, but the actual calculation will be handled in the spring boot.
"""
@app.get("/ratiocallspread/{ticker}/{expiry}/{strike}")
def fetchLegs(ticker: str, expiry: str, strike: float):
    stock = yf.Ticker(ticker)
    calls = stock.option_chain(expiry).calls
    calls["type"] = "call"
    calls = calls[["strike", "bid", "ask", "lastPrice", "type"]]
    calls["lots"] = 1
    
    sellLegIndex = calls[calls["strike"] == strike].index
    buyLegIndex = sellLegIndex - 3
    
    sellLeg = calls.iloc[sellLegIndex, :].copy()
    buyLeg = calls.iloc[buyLegIndex, :].copy()

    sellLeg["premium"] = sellLeg["bid"].fillna(sellLeg["lastPrice"]).astype(float)
    sellLeg["buySell"] = "sell"
    sellLeg.drop(['ask', 'bid', 'lastPrice'], axis=1, inplace=True)

    buyLeg["premium"] = buyLeg["ask"].fillna(buyLeg["lastPrice"]).astype(float)
    buyLeg["buySell"] = "buy"
    buyLeg.drop(['ask', 'bid', 'lastPrice'], axis=1, inplace=True)
    
    sell_leg = sellLeg.to_dict(orient='records')[0]
    buy_leg = buyLeg.to_dict(orient='records')[0]
    
    return {
        "legs": [sell_leg, buy_leg],
        "lowestStrike": float(buyLeg["strike"]),
        "highestStrike": float(sellLeg["strike"])
    }

@app.get("/ping")
def ping():
    return {"status": "ok"}

fetchLegs("AAPL", "2025-08-01", 230)