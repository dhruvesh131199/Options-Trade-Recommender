// ChartFetcher.jsx
import React, { useEffect, useState } from "react";
import CandleChart from "./CandleChart";

const javaUrl = import.meta.env.VITE_BACKEND_URL;

function ChartFetcher({ ticker }) {
  const [candles, setCandles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchCandles = async () => {
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
      }
    };

    fetchCandles();
  }, [ticker]);

  if (!ticker) return null;

  return (
    <div>
      <h5 className="card-title">{ticker} Candlestick Chart</h5>
      {error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <CandleChart data={candles} />
      )}
    </div>
  );
}

export default ChartFetcher;
