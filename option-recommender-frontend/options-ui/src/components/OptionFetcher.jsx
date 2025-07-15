// src/components/OptionFetcher.jsx
import React, { useState } from "react";
import axios from "axios";

const tickers = ["AAPL", "MSFT", "GOOG", "NVDA", "TSLA", "AMZN"];
const strategies = ["covered call", "protective put"];

function OptionFetcher() {
  const [ticker, setTicker] = useState(tickers[0]);
  const [strategy, setStrategy] = useState(strategies[0]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchOptionsData = async () => {
    try {
      const response = await axios.post("http://localhost:8080/expiries_and_strikes", {
        ticker: ticker,
        strategy: strategy,
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setData(null);
    }
  };

  return (
    <div className="card p-4 shadow">
      <div className="mb-3">
        <label className="form-label">Select Ticker</label>
        <select
          className="form-select"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        >
          {tickers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Strategy</label>
        <select
          className="form-select"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          {strategies.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={fetchOptionsData}>
        Get Options Data
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {data && (
        <div className="mt-4">
          <h5>Expiries</h5>
          <ul className="list-group mb-3">
            {data.expiries.map((exp, i) => (
              <li className="list-group-item" key={i}>
                {exp}
              </li>
            ))}
          </ul>

          <h5>Strikes</h5>
          <ul className="list-group">
            {data.strikes.map((strike, i) => (
              <li className="list-group-item" key={i}>
                {strike}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OptionFetcher;
