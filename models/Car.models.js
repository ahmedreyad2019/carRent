const mongoose = require("mongoose");
const { Schema } = mongoose;
carRenter = require("./CarRenter.models");
const CarRenterSchema = mongoose.model("carRenter").schema;
history = require("./History.models");
const HistorySchema = mongoose.model("history").schema;

const CarSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  status: {
    type: String,
    default: "PendingApproval",
    enum: ["UpForRent", "Rented", "PendingApproval", "Idle"]
  },
  history: [HistorySchema],
  rating: { type: Number, required: true, default: 5.0 },
  currentRenter: CarRenterSchema,
  currentMileage: { type: Number },
  license: { type: String, required: true },
  licenseExpiryDate: { type: Date, required: true },
  dateAdded: { type: Date }
});
module.exports = mongoose.model("Car", CarSchema);
