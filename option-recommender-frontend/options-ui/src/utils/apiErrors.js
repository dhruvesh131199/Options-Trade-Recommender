export const YAHOO_RATE_LIMIT_MESSAGE =
  "Yahoo Finance rate limit: too many requests. Please try again in a few minutes.";

export function isRateLimitMessage(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes("too many requests") || lower.includes("rate limit");
}

export function normalizeApiError(data, fallback = "Something went wrong. Please try again.") {
  if (!data) return fallback;

  if (typeof data === "string") {
    return isRateLimitMessage(data) ? YAHOO_RATE_LIMIT_MESSAGE : data;
  }

  if (data.error) {
    return isRateLimitMessage(data.error) ? YAHOO_RATE_LIMIT_MESSAGE : data.error;
  }

  return fallback;
}
