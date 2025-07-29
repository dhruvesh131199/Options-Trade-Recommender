if (!legs || legs.length === 0) return <p>No data to plot</p>;

  const data = getPayoffData(legs, lowestStrike - 20, highestStrike + 20);
  console.log("Generated Chart Data:", data);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stockPrice" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="payoff" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );