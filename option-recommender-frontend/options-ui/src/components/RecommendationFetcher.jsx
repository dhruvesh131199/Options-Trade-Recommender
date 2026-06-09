import React, { useState, useEffect, useRef } from "react";
import { normalizeApiError } from "../utils/apiErrors";

const javaUrl = import.meta.env.VITE_BACKEND_URL;
const risks = ["Low", "Medium", "High"];

function RecommendationFetcher({
  ticker,
  strategy,
  expiries,
  strikes,
  weeklyVol,
  onRecommendFetched,
  onSubmitStart,
  onSubmitComplete,
  actionsDisabled,
}) {
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [selectedStrike, setSelectedStrike] = useState("");
  const [risk, setRisk] = useState(risks[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const prevTicker = useRef();
  const prevStrategy = useRef();

  useEffect(() => {
    if (prevTicker.current === ticker && prevStrategy.current === strategy) return;

    prevTicker.current = ticker;
    prevStrategy.current = strategy;

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
  }, [ticker, strategy, expiries, strikes]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    onSubmitStart?.();

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

      if (data.error) {
        setMessage(normalizeApiError(data));
        onSubmitComplete?.(false);
        return;
      }

      if (!data.legs || data.legs.length === 0) {
        setMessage(normalizeApiError(data, "No option legs returned for the selected expiry and strike."));
        onSubmitComplete?.(false);
        return;
      }

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

      onSubmitComplete?.(true);
      console.log("Server Response:", data);

    } catch (error) {
      console.error("Fetch error:", error);
      setMessage(normalizeApiError(null, "Failed to get recommendation, please try again later"));
      onSubmitComplete?.(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formDisabled = submitting || actionsDisabled;

  return (
    <div>
      <h4>Choose Expiry & Strike</h4>
      <p><strong>Ticker:</strong> {ticker} &nbsp;&nbsp; <strong>Strategy:</strong> {strategy}</p>

      {expiries && expiries.length > 0 && strikes && strikes.length > 0 ? (
        <>
          <div className="mb-3">
            <label className="form-label">Select Expiry</label>
            <select
              className="form-select"
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              disabled={formDisabled}
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
              disabled={formDisabled}
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
            <select className="form-select" value={risk} onChange={(e) => setRisk(e.target.value)} disabled={formDisabled}>
              {risks.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-success" onClick={handleSubmit} disabled={formDisabled}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Getting recommendation...
              </>
            ) : (
              "Submit for Recommendation"
            )}
          </button>
        </>
      ) : (
        <div className="alert alert-warning mt-3">
          Please fetch expiries and strikes first.
        </div>
      )}

      {message && (
        <div className="text-wrap overflow-auto alert alert-danger mt-3">
          {message}
        </div>
      )}
    </div>
  );
}

export default RecommendationFetcher;
