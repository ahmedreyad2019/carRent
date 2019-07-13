const mongoose = require("mongoose");
const { Schema } = mongoose;

const DrivingLicenseRequestSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  responseDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Accepted", "Rejected"]
  },
  comment: { type: String },
  drivingLicenseLink: { type: String, required: true },
  expiryDate: {
    type: Date,
    required: true
  }
});
const CarRenterSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  personalID: { type: String },
  personalIDPhoto: { type: String },
  balance: { type: Number, required: true, default: 0.0 },
  password: { type: String, required: true },
  
  paymentMethod: {
    type: String,
    enum: ["Card", "Cash"],
    default: "Cash",
    required: true
  },
  cardNumber: { type: String },
  drivingLicenseRequest: DrivingLicenseRequestSchema,
  banned: { required: true, default: false, type: Boolean },
  carsOwned: { type: Array, default: [] },
  dateAdded: { type: Date },
  rating: { type: Number, required: true, default: 5.0 },

});

module.exports = mongoose.model("carRenter", CarRenterSchema);
