import { useState } from "react";

export const useSensorHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sensorData");
      const json = await res.json();
      setHistory(json);
    } catch (err) {
      console.error("Fetch history error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, refresh: fetchHistory };
};
