const mongoose = require("mongoose");
const { Schema } = mongoose;
const CarRenter = require("../models/CarRenter.models");
CarRenter.CarRenterSchema;
let HistorySchema = new Schema({
  carRenterId: { type: String, required: true },
  rentingDateStart: { type: Date, required: true },
  rentingDateEnd: { type: Date, required: true },
  complaints: [
    new Schema({
      issuedFrom: { type: String, enum: ["Renter", "Owner"] },
      date: {
        type: Date,
        required: true,
        default: Date.now()
      },
      reviewed: { type: Boolean, default: false }
    })
  ],
  carRating: { type: Number, required: true, default: 5.0 },
  renterRating: { type: Number, required: true, default: 5.0 },
  ownerRating: { type: Number, required: true, default: 5.0 }
});
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
  currentMileage: { type: Number },
  license: { type: String, required: true },
  licenseExpiryDate: { type: Date, required: true },
  dateAdded: { type: Date }
});

module.exports = mongoose.model("Car", CarSchema);
