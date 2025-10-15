import RefreshButton from "./RefreshButton";

const HistoryData = ({ data, loading, onRefresh }) => {
  return (
    <div>
       <h2>History (10 latest)</h2>
       
      <RefreshButton onClick={onRefresh} />
      {loading && <p>Loading history...</p>}

      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={item._id}>
              {new Date(item.timestamp).toLocaleTimeString()} — {item.heartRate} bpm / SpO₂ {item.SPO2}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No history loaded yet. Press Refresh.</p>
      )}
    </div>
  );
};

export default HistoryData;
