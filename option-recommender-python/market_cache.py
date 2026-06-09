import time
import threading
from typing import Any, Callable

import pandas as pd
import requests
import yfinance as yf

OPTIONS_TTL = 600       # 10 min — option chains / expiries
HISTORY_TTL = 900       # 15 min — price history / candles

_session = requests.Session()
_session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
})

_lock = threading.Lock()
_cache: dict[str, tuple[float, Any]] = {}
_tickers: dict[str, yf.Ticker] = {}


def _cache_get(key: str) -> Any | None:
    with _lock:
        entry = _cache.get(key)
        if entry is None:
            return None
        expires_at, value = entry
        if time.time() > expires_at:
            del _cache[key]
            return None
        return value


def _cache_set(key: str, value: Any, ttl: int) -> Any:
    with _lock:
        _cache[key] = (time.time() + ttl, value)
    return value


def _is_rate_limit_error(exc: Exception) -> bool:
    msg = str(exc).lower()
    return "rate limit" in msg or "too many requests" in msg


def fetch_with_retry(fn: Callable[[], Any], max_retries: int = 3) -> Any:
    last_error = None
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as exc:
            last_error = exc
            if _is_rate_limit_error(exc) and attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
    raise last_error


def get_ticker(ticker: str) -> yf.Ticker:
    symbol = ticker.upper()
    with _lock:
        if symbol not in _tickers:
            _tickers[symbol] = yf.Ticker(symbol, session=_session)
        return _tickers[symbol]


def get_expiries(ticker: str) -> tuple[str, ...]:
    key = f"expiries:{ticker.upper()}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    def load():
        return tuple(get_ticker(ticker).options)

    value = fetch_with_retry(load)
    return _cache_set(key, value, OPTIONS_TTL)


def get_last_price(ticker: str) -> float:
    key = f"ltp:{ticker.upper()}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    def load():
        return float(get_ticker(ticker).fast_info["last_price"])

    value = fetch_with_retry(load)
    return _cache_set(key, value, OPTIONS_TTL)


def get_option_chain(ticker: str, expiry: str):
    key = f"chain:{ticker.upper()}:{expiry}"
    cached = _cache_get(key)
    if cached is not None:
        return cached

    def load():
        return get_ticker(ticker).option_chain(expiry)

    value = fetch_with_retry(load)
    return _cache_set(key, value, OPTIONS_TTL)


def get_history(ticker: str, period: str, interval: str = "1d") -> pd.DataFrame:
    key = f"history:{ticker.upper()}:{period}:{interval}"
    cached = _cache_get(key)
    if cached is not None:
        return cached.copy()

    def load():
        df = yf.download(
            ticker.upper(),
            period=period,
            interval=interval,
            session=_session,
            progress=False,
        )
        if df.empty:
            raise ValueError(f"No price history returned for {ticker}")
        return df

    value = fetch_with_retry(load)
    return _cache_set(key, value.copy(), HISTORY_TTL)
