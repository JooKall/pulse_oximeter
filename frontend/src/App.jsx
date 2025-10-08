import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/sensor") // <--- just '/sensor', Vite proxy forwards it
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error(err));
    }, 5000);

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
