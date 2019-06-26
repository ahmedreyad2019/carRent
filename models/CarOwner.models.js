const mongoose = require("mongoose");
const { Schema } = mongoose;
history = require("./History.models");
const HistorySchema = mongoose.model("history").schema;
const CarOwnerSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  drivingLicense: { type: String },
  history: [HistorySchema],
  balance: { type: Number, required: true, default: 0.0 }
});

module.exports = mongoose.model("carOwner", CarOwnerSchema);
