import React, { useState, useEffect } from "react"; // <--- Import useEffect

const javaUrl = import.meta.env.VITE_BACKEND_URL;

function RecommendationFetcher({ ticker, strategy, expiries, strikes }) {
  // Initialize with empty string, as the actual default will be set by useEffect
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [selectedStrike, setSelectedStrike] = useState("");
  const [message, setMessage] = useState("");

  // This useEffect will run whenever 'expiries' or 'strikes' props change
  useEffect(() => {
    console.log("useEffect ran for RecommendationFetcher with new expiries/strikes");
    // Update selectedExpiry if expiries array has elements
    if (expiries && expiries.length > 0) {
      setSelectedExpiry(expiries[0]);
    } else {
      setSelectedExpiry(""); // Clear if expiries become empty
    }

    // Update selectedStrike if strikes array has elements
    if (strikes && strikes.length > 0) {
      setSelectedStrike(strikes[0]);
    } else {
      setSelectedStrike(""); // Clear if strikes become empty
    }

    // Also a good idea to clear the previous recommendation message
    setMessage("");

  }, [expiries, strikes]); // Dependency array: tells useEffect to re-run when these values change

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
          strike: selectedStrike,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get more specific error from response body
        throw new Error(`HTTP error! status: ${response.status}. Message: ${errorText}`);
      }

      const result = await response.json();
      setMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage(`Failed to get recommendation: ${error.message || error}`);
    }
  };

  return (
    <div className="card p-4 shadow">
      <h4>Step 2: Choose Expiry & Strike</h4>
      <p><strong>Ticker:</strong> {ticker} &nbsp;&nbsp; <strong>Strategy:</strong> {strategy}</p>

      {/* Check if expiries/strikes are available before rendering selects */}
      {expiries && expiries.length > 0 && strikes && strikes.length > 0 ? (
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

          <button className="btn btn-success" onClick={handleSubmit}>
            Submit for Recommendation
          </button>
        </>
      ) : (
        <div className="alert alert-warning mt-3">
          Please fetch expiries and strikes first.
        </div>
      )}


      {message && <div className="alert alert-info mt-3"><pre>{message}</pre></div>}
    </div>
  );
}

export default RecommendationFetcher;