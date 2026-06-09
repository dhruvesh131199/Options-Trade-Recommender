import React, { useState, useRef } from "react";
import axios from "axios";
import { normalizeApiError, getCacheNotice } from "../utils/apiErrors";

const javaUrl = import.meta.env.VITE_BACKEND_URL;

const tickers = ["AAPL", "MSFT", "GOOG", "NVDA", "TSLA", "AMZN"];
const strategies = ["Ratio Call Spread"];

function ExpiryStrikeFetcher({ onDataFetched, onResetRecommendation, onFetchStart, onFetchComplete, actionsDisabled }) {
  const lastFetched = useRef({ ticker: null, strategy: null });
  const [ticker, setTicker] = useState(tickers[0]);
  const [strategy, setStrategy] = useState(strategies[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExpiryStrike = async () => {
    const hasChanged = ticker !== lastFetched.current.ticker || strategy !== lastFetched.current.strategy;

    if (hasChanged && onResetRecommendation) {
      onResetRecommendation();
    }

    setLoading(true);
    onFetchStart?.();

    try {
      const response = await axios.post(`${javaUrl}/expiries_and_strikes`, {
        ticker,
        strategy,
      }, { timeout: 90000 });

      if (response.data.error) {
        setError(normalizeApiError(response.data));
        onFetchComplete?.(false);
        return;
      }

      if (!response.data.expiries?.length || !response.data.strikes?.length) {
        setError(normalizeApiError(response.data, "Could not load expiries and strikes."));
        onFetchComplete?.(false);
        return;
      }

      onDataFetched({
        ticker,
        strategy,
        expiries: response.data.expiries,
        strikes: response.data.strikes,
        weeklyVol: response.data.weeklyVol,
        cacheNotice: getCacheNotice(response.data),
      });
      lastFetched.current = { ticker, strategy };
      setError(null);
      onFetchComplete?.(true);
    } catch (err) {
      console.error(err);
      setError(normalizeApiError(err.response?.data, "Failed to fetch data. The server may still be waking up — try again in a moment."));
      onFetchComplete?.(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Choose Ticker & Strategy</h4>

      <div className="mb-3">
        <label className="form-label">Select Ticker</label>
        <select className="form-select" value={ticker} onChange={(e) => setTicker(e.target.value)} disabled={loading || actionsDisabled}>
          {tickers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Strategy</label>
        <select className="form-select" value={strategy} onChange={(e) => setStrategy(e.target.value)} disabled={loading || actionsDisabled}>
          {strategies.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={fetchExpiryStrike} disabled={loading || actionsDisabled}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Fetching...
          </>
        ) : (
          "Fetch Expiries & Strikes"
        )}
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default ExpiryStrikeFetcher;
