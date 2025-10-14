const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  heartRate: Number,
  heartRateValid: Number,
  SPO2: Number,
  SPO2Valid: Number,
  timestamp: { type: Date, default: Date.now },
});

sensorSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("SensorData", sensorSchema);
