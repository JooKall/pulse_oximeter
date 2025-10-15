import { useLatestSensorData } from "./hooks/useLatestSensorData";
import { useSensorHistory } from "./hooks/useSensorHistory";
import LatestData from "./components/LatestData";
import HistoryData from "./components/HistoryData";

const App = () => {
  const { data, loading: latestLoading } = useLatestSensorData(5000);
  const { history, loading: historyLoading, refresh } = useSensorHistory();

  return (
    <div>
      <h1>MAX30102 Sensor Data</h1>

      <LatestData data={data} loading={latestLoading} />

      <HistoryData
        data={history}
        loading={historyLoading}
        onRefresh={refresh}
      />
    </div>
  );
};

export default App;
