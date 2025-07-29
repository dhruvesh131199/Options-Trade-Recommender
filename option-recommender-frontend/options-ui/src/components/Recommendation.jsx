import React, { useEffect, useState } from "react";

function Recommendation({ legs, ticker, expiry, strategy, risk, strikeWithHowFar }) {
  const [loading, setLoading] = useState(false);
  const [processedLegs, setProcessedLegs] = useState([]);
  const [netLabel, setNetLabel] = useState("");
  const [netValue, setNetValue] = useState(0);

  useEffect(() => {
    if (!legs || legs.length === 0) return;

    setLoading(true);
    const startTime = Date.now();

    const process = () => {
      let totalDebit = 0;
      let totalCredit = 0;

      const newProcessedLegs = legs.map((leg) => {
        const value = leg.premium * leg.lots;
        if (leg.buySell.toLowerCase() === "buy") {
          totalDebit += value;
          return { ...leg, valueType: "Debit", value: value.toFixed(2) };
        } else {
          totalCredit += value;
          return { ...leg, valueType: "Credit", value: value.toFixed(2) };
        }
      });

      const net = totalCredit - totalDebit;
      const label = net >= 0 ? "Net Credit" : "Net Debit";

      setProcessedLegs(newProcessedLegs);
      setNetLabel(label);
      setNetValue(Math.abs(net).toFixed(2));

      const elapsed = Date.now() - startTime;
      const remaining = 1000 - elapsed;
      setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
    };

    process();
  }, [legs, ticker, expiry, strategy, risk, strikeWithHowFar]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="card-title">Option Legs</h4>
      <span>
        <strong>Ticker:</strong> {ticker} &nbsp;&nbsp;
        <strong>Strategy:</strong> {strategy}
      </span>
      <br />
      <span>
        <strong>Risk:</strong> {risk}
      </span>
      <ul className="list-group mt-3">
        {processedLegs.map((leg, index) => (
          <li key={index} className="list-group-item">
            <span
              className={`fw-bold me-2 text-capitalize ${
                leg.buySell.toLowerCase() === "buy" ? "text-success" : "text-danger"
              }`}
            >
              {leg.buySell}
            </span>
            {leg.lots} lot(s) of <strong>{leg.strike}</strong> expiring on{" "}
            <strong>{leg.expiry || expiry}</strong> at <i>${leg.premium}</i> &nbsp;&nbsp;&nbsp;&nbsp;
            <mark>
              <strong>{leg.valueType}</strong>: <i>${leg.value}</i>
            </mark>
          </li>
        ))}
        <div className="fw-bold mt-3">
          <mark>{netLabel}: ${netValue}</mark>
        </div>
      </ul>
    </div>
  );
}

export default Recommendation;
