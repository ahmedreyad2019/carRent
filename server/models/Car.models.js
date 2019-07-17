const mongoose = require("mongoose");
const { Schema } = mongoose;
carRenter = require("./CarRenter.models");
const CarRenterSchema = mongoose.model("carRenter").schema;

const CarSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  status: {
    type: String,
    default: "PendingApproval",
    enum: ["UpForRent", "Rented", "PendingApproval", "Idle", "Rejected"]
  },
  rating: { type: Number, required: true, default: 5.0 },
  currentRenter: CarRenterSchema,
  licenseLink: { type: String, required: true },
  plateNumber: { type: String, required: true },
  licenseExpiryDate: { type: Date, required: true },
  dateAdded: { type: Date },
  category: { type: String, enum: ["A", "B", "C"] },
  carOwnerID: { type: String, required: true },
  transmission: { type: String, enum: ["Automatic", "Manual"] },
  color: { type: String },
  seatingCapacity: { type: Number },
  photosLink: [{ type: String,required:true }],
  banned: { required: true, default: false, type: Boolean },
  comment:{type:String},
  kilometers:{type:String,required:true,enum:["0-50","50-100","100-150","150-200","200+"]}
});
module.exports = mongoose.model("Car", CarSchema);
