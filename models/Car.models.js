const mongoose = require("mongoose");
const { Schema } = mongoose;
carRenter = require("./CarRenter.models");
const CarRenterSchema = mongoose.model("carRenter").schema;
transaction = require("./Transaction.models");
const TransactionSchema = mongoose.model("transaction").schema;

const CarSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  status: {
    type: String,
    default: "PendingApproval",
    enum: ["UpForRent", "Rented", "PendingApproval", "Idle"]
  },
  transaction: [TransactionSchema],
  rating: { type: Number, required: true, default: 5.0 },
  currentRenter: CarRenterSchema,
  currentMileage: { type: Number },
  licenseLink: { type: String, required: true },
  plateNumber: { type: String, required: true },
  licenseExpiryDate: { type: Date, required: true },
  dateAdded: { type: Date },
  location: { type: String, required: true },
  category: { type: String, enum: ["A", "B", "C"] },
  carOwnerID: { type: String, required: true },
  photosLink: { type: String }
});
module.exports = mongoose.model("Car", CarSchema);
