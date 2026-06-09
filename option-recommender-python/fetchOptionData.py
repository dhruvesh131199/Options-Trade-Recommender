from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
from datetime import datetime
import pandas as pd

from yahoo_errors import error_payload
from cache_store import cache_key, fetch_with_cache
from market_data import (
    safe_fetch_candles,
    safe_fetch_expiries_and_strikes,
    safe_fetch_ratio_call_spread,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/options/{ticker}")
def get_options(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        expiries = stock.options

        expiries = [datetime.strptime(d, "%Y-%m-%d") for d in expiries]
        today = datetime.today()
        filtered_expiries = [
            d.strftime("%Y-%m-%d")
            for d in expiries
            if ((abs(d - today).days) <= 14 and (abs(d - today).days) >= 7)
        ]

        all_options = pd.DataFrame()

        for expiry in filtered_expiries:
            option_chain = stock.option_chain(expiry)
            calls = option_chain.calls
            calls = calls[calls["inTheMoney"] == False]
            calls["optionType"] = "CE"
            calls["expiry"] = expiry
            calls["dte"] = (datetime.strptime(expiry, "%Y-%m-%d") - today).days
            all_options = pd.concat([calls, all_options])

            puts = option_chain.puts
            puts = puts[puts["inTheMoney"] == False]
            puts["optionType"] = "PE"
            puts["expiry"] = expiry
            puts["dte"] = (datetime.strptime(expiry, "%Y-%m-%d") - today).days
            all_options = pd.concat([puts, all_options])

        all_options = all_options.reset_index(drop=True)
        all_options["ticker"] = ticker
        all_options["roi"] = round(all_options["lastPrice"] / all_options["strike"], 4)

        all_options = all_options[
            ["ticker", "optionType", "strike", "expiry", "dte", "lastPrice", "roi"]
        ]
        all_options.columns = [
            "ticker",
            "optionType",
            "strikePrice",
            "expiryDate",
            "DTE",
            "premium",
            "roi",
        ]

        return all_options.to_dict(orient="records")

    except Exception as e:
        return error_payload(e)


@app.get("/expiry_and_strikes/{ticker}/{strategy}")
def get_expiries_and_strikes(ticker: str, strategy: str):
    key = cache_key("expiry_and_strikes", ticker, strategy)
    return fetch_with_cache(
        key, lambda: safe_fetch_expiries_and_strikes(ticker, strategy)
    )


@app.get("/candles/{ticker}")
def getCandles(ticker: str):
    key = cache_key("candles", ticker)
    return fetch_with_cache(key, lambda: safe_fetch_candles(ticker))


@app.get("/ratiocallspread/{ticker}/{expiry}/{strike}")
def fetchLegs(ticker: str, expiry: str, strike: float):
    key = cache_key("ratiocallspread", ticker, expiry, str(strike))
    return fetch_with_cache(
        key, lambda: safe_fetch_ratio_call_spread(ticker, expiry, strike)
    )


@app.get("/ping")
def ping():
    return {"status": "ok"}
