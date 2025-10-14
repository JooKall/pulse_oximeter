import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Function to fetch latest sensor reading
    const fetchSensorData = () => {
      fetch("/api/sensor/latest") // <-- new endpoint
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((json) => setData(json))
        .catch((err) => console.error(err));
    };

    // Fetch immediately
    fetchSensorData();

    // Fetch every 5 seconds
    const interval = setInterval(fetchSensorData, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>MAX30102 Sensor Data</h1>
      {data ? (
        <>
          <p>
            Heart Rate: {data.heartRate} (valid: {data.heartRateValid})
          </p>
          <p>
            SPO2: {data.SPO2} (valid: {data.SPO2Valid})
          </p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
