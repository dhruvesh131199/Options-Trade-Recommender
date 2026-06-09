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
        setLoading(false);
      }
    };

    fetchCandles();
  }, [ticker]);

  if (!ticker) return null;

  return (
    <div>
      <h5 className="card-title">{ticker} Candlestick Chart</h5>
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small mb-0">Loading chart data...</p>
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
