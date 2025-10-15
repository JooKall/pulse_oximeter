const LatestData = ({ data, loading }) => {
  
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div>
      <h2>Latest Reading</h2>
      <p>
        Heart Rate: {data.heartRate} (valid: {data.heartRateValid})
      </p>
      <p>
        SPO2: {data.SPO2} (valid: {data.SPO2Valid})
      </p>
      <p>
        Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default LatestData;