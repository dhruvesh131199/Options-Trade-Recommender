import React, { useEffect, useState } from "react";
import CandleChart from "./CandleChart";

const javaUrl = import.meta.env.VITE_BACKEND_URL;

function ChartFetcher({ ticker }) {
  const [candles, setCandles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker) return;

    const fetchCandles = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        const res = await fetch(`${javaUrl}/candles`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: ticker,
        });
        const data = await res.json();
        setCandles(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch candle data:", err);
        setError("Error loading chart");
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = 1000 - elapsed;
        setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };

    fetchCandles();
  }, [ticker]);

  if (!ticker) return null;

  return (
    <div>
      <h5 className="card-title">{ticker} Candlestick Chart</h5>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <CandleChart data={candles} />
      )}
    </div>
  );
}

export default ChartFetcher;
