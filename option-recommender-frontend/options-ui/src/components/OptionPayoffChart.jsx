import React, { useState, useEffect } from "react";
import {
  LineChart,
  ReferenceLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const getPayoffData = (legs, lowestStrike, highestPrice, step = 0.5) => {
  const stockPrices = [];
  for (let i = lowestStrike; i <= highestPrice; i += step) {
    stockPrices.push(i);
  }

  const payoffData = stockPrices.map((S) => {
    let totalPayoff = 0;

    legs.forEach((leg) => {
      const { type, buySell: action, strike, premium, lots } = leg;

      let intrinsicValue = 0;
      if (type === "call") intrinsicValue = Math.max(S - strike, 0);
      else if (type === "put") intrinsicValue = Math.max(strike - S, 0);

      let payoff = 0;
      if (action === "buy") payoff = (intrinsicValue - premium) * lots;
      else if (action === "sell") payoff = (-intrinsicValue + premium) * lots;

      totalPayoff += payoff;
    });

    return { stockPrice: S, payoff: totalPayoff };
  });

  return payoffData;
};

const OptionPayoffChart = ({ legs, ticker, expiry, strategy, risk, strikeWithHowFar, lowestStrike, highestStrike }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!legs || legs.length === 0) {
      setLoading(false);
      return;
    }

    const startTime = Date.now();
    console.log(legs);
    const data = getPayoffData(legs, lowestStrike - 10, highestStrike + 10);
    setChartData(data);

    const elapsed = Date.now() - startTime;
    const remaining = 1000 - elapsed;
    setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
  }, [legs, ticker, expiry, strategy, risk, strikeWithHowFar]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) return <p>No data to plot</p>;

  return (
    <LineChart
      width={700}
      height={450}
      data={chartData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="stockPrice" label={{ value: 'Stock price', position: 'bottom', dy: 20 }}/>
      <YAxis label={{ value: 'Payoff', position: 'insideLeft', angle: -90 }}/>
      <Tooltip />
      <Legend verticalAlign="top" align="right"/>
      <ReferenceLine y={0} stroke="blue" strokeWidth={1} strokeDasharray="0" />
      <ReferenceLine x={lowestStrike} stroke="red" strokeWidth={1} strokeDasharray="0" />
      <ReferenceLine x={highestStrike} stroke="red" strokeWidth={1} strokeDasharray="0" />
      <Line
        type="monotone"
        dataKey="payoff"
        stroke="purple"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 2 }}
      />
    </LineChart>
  );
};

export default OptionPayoffChart;
