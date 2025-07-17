import React, { useState } from "react";
import axios from "axios";

const javaApiBaseUrl = import.meta.env.VITE_JAVA_API_URL || "http://java-backend:8080";

const tickers = ["AAPL", "MSFT", "GOOG", "NVDA", "TSLA", "AMZN"];
const strategies = ["covered call", "protective put"];

function ExpiryStrikeFetcher({ onDataFetched }) {
  const [ticker, setTicker] = useState(tickers[0]);
  const [strategy, setStrategy] = useState(strategies[0]);
  const [error, setError] = useState(null);

  const fetchExpiryStrike = async () => {
    try {
      const response = await axios.post("http://localhost:8080/expiries_and_strikes", {
        ticker,
        strategy,
      });

      onDataFetched({
        ticker,
        strategy,
        expiries: response.data.expiries,
        strikes: response.data.strikes,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    }
  };

  return (
    <div className="card p-4 shadow mb-4">
      <h4>Step 1: Choose Ticker & Strategy</h4>

      <div className="mb-3">
        <label className="form-label">Select Ticker</label>
        <select className="form-select" value={ticker} onChange={(e) => setTicker(e.target.value)}>
          {tickers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Strategy</label>
        <select className="form-select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          {strategies.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={fetchExpiryStrike}>
        Fetch Expiries & Strikes
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default ExpiryStrikeFetcher;
