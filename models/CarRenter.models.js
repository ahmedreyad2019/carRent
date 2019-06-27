const mongoose = require("mongoose");
const { Schema } = mongoose;

transaction = require("./Transaction.models");
const TransactionSchema = mongoose.model("transaction").schema;

const CarRenterSchema = new Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  drivingLicenseLink: { type: String },
  personalID: { type: String },
  transaction: [TransactionSchema],
  balance: { type: Number, required: true, default: 0.0 },
  password: { type: String, required: true },
  statusID: { type: String, enum: ["Pending", "Rejected", "Accepted"] },
  paymentMethod: {
    type: String,
    enum: ["Card", "Cash"],
    default: "Cash",
    required: true
  },
  cardNumber: { type: String },
  validated: { type: Boolean, default: false }
});

module.exports = mongoose.model("carRenter", CarRenterSchema);
