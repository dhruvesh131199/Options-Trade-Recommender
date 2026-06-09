"""
Run locally while Yahoo Finance is working to build data_cache/ JSON files.
Commit data_cache/ and deploy — Render will use these when rate limited.

  cd option-recommender-python
  pip install -r requirements.txt
  python populate_cache.py
"""
import time

from cache_store import cache_key, write_cache
from market_data import (
    fetch_candles,
    fetch_expiries_and_strikes,
    fetch_ratio_call_spread,
)

TICKERS = ["AAPL", "MSFT", "GOOG", "NVDA", "TSLA", "AMZN"]
STRATEGY = "ratio call spread"
PAUSE_SECONDS = 2
MAX_STRIKES_PER_TICKER = 20


def parse_strike(strike_label: str) -> float:
    return float(strike_label.split("|")[0].strip())


def main():
    for ticker in TICKERS:
        print(f"\n=== {ticker} ===")

        print("  expiries & strikes...")
        expiry_data = fetch_expiries_and_strikes(ticker, STRATEGY)
        write_cache(cache_key("expiry_and_strikes", ticker, STRATEGY), expiry_data)
        time.sleep(PAUSE_SECONDS)

        print("  candles...")
        candles = fetch_candles(ticker)
        write_cache(cache_key("candles", ticker), candles)
        time.sleep(PAUSE_SECONDS)

        expiries = expiry_data.get("expiries") or []
        strikes = expiry_data.get("strikes") or []
        if not expiries or not strikes:
            print(f"  skipped ratio spreads (no expiries/strikes): {expiry_data}")
            continue

        expiry = expiries[0]
        for strike_label in strikes[:MAX_STRIKES_PER_TICKER]:
            strike = parse_strike(strike_label)
            print(f"  ratio call spread @ {expiry} strike {strike}...")
            spread = fetch_ratio_call_spread(ticker, expiry, strike)
            write_cache(cache_key("ratiocallspread", ticker, expiry, str(strike)), spread)
            time.sleep(PAUSE_SECONDS)

    print("\nDone. Commit option-recommender-python/data_cache/ and deploy.")


if __name__ == "__main__":
    main()
