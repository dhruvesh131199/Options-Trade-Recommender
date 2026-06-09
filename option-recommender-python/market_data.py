from datetime import datetime

import pandas as pd
import yfinance as yf

from yahoo_errors import error_payload


def fetch_expiries_and_strikes(ticker: str, strategy: str) -> dict:
    stock = yf.Ticker(ticker)
    expiries = stock.options
    ltp = stock.fast_info["last_price"]

    expiries = [datetime.strptime(d, "%Y-%m-%d") for d in expiries]
    expiries = [d.strftime("%Y-%m-%d") for d in expiries]
    expiries = expiries[:4]

    all_strikes = set()
    sorted_strikes = []

    for expiry in expiries:
        option_chain = stock.option_chain(expiry)
        if strategy.lower() == "ratio call spread":
            strikes = option_chain.calls[option_chain.calls["inTheMoney"] == False]["strike"].tolist()
            all_strikes.update(strikes)
            sorted_strikes = sorted(all_strikes)

        if strategy.lower() == "ratio put spread":
            strikes = option_chain.puts[option_chain.puts["inTheMoney"] == False]["strike"].tolist()
            all_strikes.update(strikes)
            sorted_strikes = sorted(all_strikes, reverse=True)

    for i in range(len(sorted_strikes)):
        sorted_strikes[i] = (
            str(sorted_strikes[i])
            + " | "
            + str(round(((abs(sorted_strikes[i] - ltp) * 100) / ltp), 2))
            + "% away"
        )

    df = yf.download(ticker, period="60d", interval="1d")
    df.columns = [col[0] for col in df.columns]
    df = df[["Open", "High", "Low"]].dropna()
    df["start_date"] = df.index
    df["end_date"] = df.index

    weekly = df.resample("W").agg(
        {
            "Open": "first",
            "High": "max",
            "Low": "min",
            "start_date": "min",
            "end_date": "max",
        }
    )

    weekly["trading_days"] = df.resample("W").size()
    weekly = weekly[weekly["trading_days"] >= 4]
    weekly["percent_range"] = (weekly["High"] - weekly["Low"]) / weekly["Open"] * 100

    weekly_vol = []
    for _, row in weekly.tail(4).iterrows():
        start = row["start_date"].strftime("%d %b %Y")
        end = row["end_date"].strftime("%d %b %Y")
        weekly_vol.append(f"{start} - {end}: {row['percent_range']:.2f}%")

    return {
        "expiries": expiries,
        "strikes": sorted_strikes,
        "weeklyVol": weekly_vol,
    }


def fetch_candles(ticker: str) -> list:
    data = yf.download(ticker.upper(), period="1y", interval="1d")
    data.columns = [col[0] for col in data.columns]
    data = data.sort_values(by="Date")

    candles = []
    for idx, row in data.iterrows():
        time_unix = int(idx.timestamp())
        candles.append(
            {
                "time": int(time_unix),
                "open": round(row["Open"], 2),
                "high": round(row["High"], 2),
                "low": round(row["Low"], 2),
                "close": round(row["Close"], 2),
            }
        )
    return candles


def fetch_ratio_call_spread(ticker: str, expiry: str, strike: float) -> dict:
    stock = yf.Ticker(ticker)
    calls = stock.option_chain(expiry).calls
    calls["type"] = "call"
    calls = calls[["strike", "bid", "ask", "lastPrice", "type"]].copy()
    calls["lots"] = 1
    calls = calls.reset_index(drop=True)

    sell_matches = calls[calls["strike"] == strike]
    if sell_matches.empty:
        return {"error": f"Strike {strike} not found for expiry {expiry}"}

    sell_leg_idx = int(sell_matches.index[0])
    buy_leg_idx = sell_leg_idx - 3
    if buy_leg_idx < 0:
        return {"error": "Not enough lower strikes for ratio call spread (need 3 below sell strike)"}

    sellLeg = calls.iloc[sell_leg_idx].copy()
    buyLeg = calls.iloc[buy_leg_idx].copy()

    sellLeg["premium"] = float(sellLeg["bid"] if pd.notna(sellLeg["bid"]) else sellLeg["lastPrice"])
    sellLeg["buySell"] = "sell"

    buyLeg["premium"] = float(buyLeg["ask"] if pd.notna(buyLeg["ask"]) else buyLeg["lastPrice"])
    buyLeg["buySell"] = "buy"

    sell_leg = {
        "strike": float(sellLeg["strike"]),
        "premium": sellLeg["premium"],
        "buySell": sellLeg["buySell"],
        "lots": float(sellLeg["lots"]),
        "type": sellLeg["type"],
    }
    buy_leg = {
        "strike": float(buyLeg["strike"]),
        "premium": buyLeg["premium"],
        "buySell": buyLeg["buySell"],
        "lots": float(buyLeg["lots"]),
        "type": buyLeg["type"],
    }

    return {
        "legs": [sell_leg, buy_leg],
        "lowestStrike": buy_leg["strike"],
        "highestStrike": sell_leg["strike"],
    }


def safe_fetch_expiries_and_strikes(ticker: str, strategy: str) -> dict:
    try:
        return fetch_expiries_and_strikes(ticker, strategy)
    except Exception as e:
        return error_payload(e)


def safe_fetch_candles(ticker: str):
    try:
        return fetch_candles(ticker)
    except Exception as e:
        return error_payload(e)


def safe_fetch_ratio_call_spread(ticker: str, expiry: str, strike: float) -> dict:
    try:
        return fetch_ratio_call_spread(ticker, expiry, strike)
    except Exception as e:
        return error_payload(e)
