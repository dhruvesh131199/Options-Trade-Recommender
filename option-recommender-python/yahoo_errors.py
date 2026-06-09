YAHOO_RATE_LIMIT_MESSAGE = (
    "Yahoo Finance rate limit: too many requests. Please try again in a few minutes."
)


def is_rate_limited(exc: Exception) -> bool:
    msg = str(exc).lower()
    return "too many requests" in msg or "rate limit" in msg


def error_payload(exc: Exception) -> dict:
    if is_rate_limited(exc):
        return {"error": YAHOO_RATE_LIMIT_MESSAGE}
    return {"error": str(exc)}
