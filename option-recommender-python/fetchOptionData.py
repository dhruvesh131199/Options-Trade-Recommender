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

@app.get("/options/{ticker}")
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
    

@app.get("/options/{ticker}/{strategy}")
def get_expiries_and_strikes(ticker: str, strategy: str):
    try:
        stock = yf.Ticker(ticker)
        expiries = stock.options
        
        #We only return options with expiries less than 14 days
        expiries= [datetime.strptime(d, "%Y-%m-%d") for d in expiries]
        today = datetime.today()
        expiries = [d.strftime("%Y-%m-%d") for d in expiries]
        expiries = expiries[:4]

        all_strikes = set()

        for expiry in expiries:
            option_chain = stock.option_chain(expiry)
            ##handle calls
            if strategy.lower() == "covered call":
                all_strikes.update(option_chain.calls[option_chain.calls["inTheMoney"] == False]['strike'].tolist())
            
            if strategy.lower() == "protective put":
                all_strikes.update(option_chain.puts[option_chain.puts["inTheMoney"] == False]['strike'].tolist())

        return {
            "expiries": expiries,
            "strikes": sorted(all_strikes)
        }
    
    except Exception as e:
        return {"error": str(e)}

def hello():
    hello = "hello brother"