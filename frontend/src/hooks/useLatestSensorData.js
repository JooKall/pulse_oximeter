import { useState, useEffect } from "react";

export const useLatestSensorData = (intervalMs = 5000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSensorData = async () => {
    try {
      const res = await fetch("/api/sensorData/latest");
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData(); // Fetch immediately

    const interval = setInterval(fetchSensorData, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { data, loading };
};
