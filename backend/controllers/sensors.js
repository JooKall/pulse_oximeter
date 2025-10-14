const sensorsRouter = require("express").Router();
const SensorData = require("../models/sensorData");

sensorsRouter.get("/", async (req, res) => {
  const data = await SensorData.find({}).sort({ timestamp: -1 }).limit(10);
  res.json(data);
});

sensorsRouter.get("/latest", async (req, res) => {
  const latestData = await SensorData.findOne({}).sort({ timestamp: -1 });
  if (!latestData) {
    // return dummy JSON instead of plain 404
    return res
      .status(404)
      .json({ heartRate: 0, SPO2: 0, heartRateValid: 0, SPO2Valid: 0 });
  }
  res.json(latestData);
});

sensorsRouter.post("/", async (req, res) => {
  const data = new SensorData(req.body);

  console.log(data);

  if (!data.heartRate || !data.SPO2) {
    return res.status(400).json({ error: "heartrate or SPO2 missing" });
  }

  const savedData = await data.save();
  res.status(201).json(savedData);
});

module.exports = sensorsRouter;
