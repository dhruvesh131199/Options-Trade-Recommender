import json
import os
import re
from typing import Any, Callable, Optional

from yahoo_errors import error_payload

CACHE_DIR = os.path.join(os.path.dirname(__file__), "data_cache")
CACHE_NOTICE = (
    "Yahoo Finance rate limit — showing cached data. Results may be slightly outdated."
)


def cache_key(*parts: str) -> str:
    slug = "_".join(parts).lower()
    slug = re.sub(r"[^a-z0-9._-]+", "_", slug)
    return slug


def _cache_path(key: str) -> str:
    return os.path.join(CACHE_DIR, f"{key}.json")


def read_cache(key: str) -> Optional[Any]:
    path = _cache_path(key)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def strip_cache_meta(data: Any) -> Any:
    if isinstance(data, dict):
        return {
            k: v
            for k, v in data.items()
            if k not in ("fromCache", "cacheNotice")
        }
    return data


def mark_cached(data: Any) -> Any:
    if isinstance(data, dict):
        marked = strip_cache_meta(data)
        marked["fromCache"] = True
        marked["cacheNotice"] = CACHE_NOTICE
        return marked
    if isinstance(data, list):
        return {
            "candles": data,
            "fromCache": True,
            "cacheNotice": CACHE_NOTICE,
        }
    return data


def write_cache(key: str, data: Any) -> None:
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = _cache_path(key)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(strip_cache_meta(data), f, indent=2)


def is_error_response(result: Any) -> bool:
    return isinstance(result, dict) and "error" in result


def fetch_with_cache(key: str, fetch_fn: Callable[[], Any]) -> Any:
    """Try live Yahoo data; on success refresh cache. On failure use cached file."""
    try:
        result = fetch_fn()
        if is_error_response(result):
            cached = read_cache(key)
            if cached is not None:
                return mark_cached(cached)
            return result
        write_cache(key, result)
        return result
    except Exception as exc:
        cached = read_cache(key)
        if cached is not None:
            return mark_cached(cached)
        return error_payload(exc)
