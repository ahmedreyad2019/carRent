const mongoose = require("mongoose");
const { Schema } = mongoose;

const ComplaintSchema = new Schema({
  issuedFrom: { type: String, enum: ["Renter", "Owner"] },
  issuedAgainst: { type: String, enum: ["Renter", "Owner", "Car"] },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  reviewed: { type: Boolean, default: false },
  comment: { type: String, required: true },
  transactionID: { type: String, required: true }
});
module.exports = mongoose.model("complaint", ComplaintSchema);
