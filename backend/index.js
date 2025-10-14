const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");

const Sensor = require("./models/sensor");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ message: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response
      .status(400)
      .json({ name: error.name, message: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());

app.get("/api/sensor", async (req, res) => {
  const data = await Sensor.find({}).sort({ timestamp: -1 }).limit(10);
  res.json(data);
});

app.get("/api/sensor/latest", async (req, res, next) => {
  try {
        const latestData = await Sensor.findOne({}).sort({ timestamp: -1 });
    if (!latestData) {
      // return dummy JSON instead of plain 404
      return res.status(404).json({ heartRate: 0, SPO2: 0, heartRateValid: 0, SPO2Valid: 0 });
    }
    res.json(latestData);
  } catch (error) {
    next(error);
  }
});

app.post("/api/sensor", async (req, res) => {
  const data = new Sensor(req.body);

  console.log(data)

  if (!data.heartRate || !data.SPO2) {
    return res.status(400).json({ error: "heartrate or SPO2 missing" });
  }

  const savedData = await data.save();
  res.status(201).json(savedData);
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
