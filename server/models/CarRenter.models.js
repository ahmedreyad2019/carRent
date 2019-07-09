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
  expiryDate:{
    type:Date,
    required:true
  }
});
const CarRenterSchema = new Schema({
<<<<<<< HEAD
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  email: { type: String, required: true },
=======
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
>>>>>>> 6aa4b54d3daad69a32ea1429957a3b20918a884a
  mobileNumber: { type: String, required: true },
  personalID: { type: String },
  personalIDPhoto:{type:String},
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
  drivingLicenseRequest: DrivingLicenseRequestSchema,
  banned: { required: true, default: false, type: Boolean },
  carsOwned:{type:Array,default:[]},
  dateAdded:{ type: Date}
});

module.exports = mongoose.model("carRenter", CarRenterSchema);
