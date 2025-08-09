import React, { useState, useEffect, useRef } from "react";

const javaUrl = import.meta.env.VITE_BACKEND_URL;
const risks = ["Low", "Medium", "High"];

function RecommendationFetcher({ ticker, strategy, expiries, strikes, weeklyVol, onRecommendFetched }) {
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [selectedStrike, setSelectedStrike] = useState("");
  const [risk, setRisk] = useState(risks[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const prevTicker = useRef();
  const prevStrategy = useRef();

  useEffect(() => {
    // Only run effect if ticker or strategy actually changed
    if (prevTicker.current === ticker && prevStrategy.current === strategy) return;

    prevTicker.current = ticker;
    prevStrategy.current = strategy;

    const startTime = Date.now();
    setLoading(true);

    if (expiries && expiries.length > 0) {
      setSelectedExpiry(expiries[0]);
    } else {
      setSelectedExpiry("");
    }

    if (strikes && strikes.length > 0) {
      setSelectedStrike(strikes[0]);
    } else {
      setSelectedStrike("");
    }

    setMessage("");

    const elapsed = Date.now() - startTime;
    const remaining = 1000 - elapsed;
    setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
  }, [ticker, strategy]);

  const handleSubmit = async () => {

    try {
      const response = await fetch(`${javaUrl}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          strategy,
          expiry: selectedExpiry,
          strikeWithHowFar: selectedStrike,
          risk: risk
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessage("");

      onRecommendFetched({
          ticker,
          strategy,
          expiry: selectedExpiry,
          risk: risk,
          legs: data.legs,
          lowestStrike: data.lowestStrike,
          highestStrike: data.highestStrike,
          strikeWithHowFar: selectedStrike
      });

      console.log("Server Response:", data);

    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Failed to get recommendation, please try again later");
    }
  };

  return (
    <div>
      <h4>Choose Expiry & Strike</h4>
      <p><strong>Ticker:</strong> {ticker} &nbsp;&nbsp; <strong>Strategy:</strong> {strategy}</p>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : expiries && expiries.length > 0 && strikes && strikes.length > 0 ? (
        <>
          <div className="mb-3">
            <label className="form-label">Select Expiry</label>
            <select
              className="form-select"
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
            >
              {expiries.map((exp, i) => (
                <option key={i} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Strike</label>
            <p className="fw-bold">Select a strike price you think stock won't cross before the chosen expiry</p>
            <select
              className="form-select"
              value={selectedStrike}
              onChange={(e) => setSelectedStrike(e.target.value)}
            >
              {strikes.map((strike, i) => (
                <option key={i} value={strike}>{strike}</option>
              ))}
            </select>
          </div>

          {/* Past Weekly Volatility Info */}
          {weeklyVol && weeklyVol.length > 0 && (
            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: "0.8rem" }}>Past 4 Week Volatilities</label>
              <ul className="list-unstyled" style={{ fontStyle: "italic", fontSize: "0.7rem", color: "#555" }}>
                {weeklyVol.map((entry, index) => (
                  <li key={index}>• {entry}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Select Risk</label>
            <select className="form-select" value={risk} onChange={(e) => setRisk(e.target.value)}>
              {risks.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-success" onClick={handleSubmit}>
            Submit for Recommendation
          </button>
        </>
      ) : (
        <div className="alert alert-warning mt-3">
          Please fetch expiries and strikes first.
        </div>
      )}

      {message && (
        <div className="text-wrap overflow-auto alert alert-info mt-3">
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
}

export default RecommendationFetcher;
