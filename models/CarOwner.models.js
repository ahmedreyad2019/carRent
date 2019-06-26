const mongoose = require("mongoose");
const { Schema } = mongoose;
const TransactionSchema = mongoose.model("transaction").schema;
const CarSchema=mongoose.model("Car").schema;
const CarOwnerSchema = new Schema({
  FirstName: { type: String, required: true },
  LastName:{ type: String, required: true },
  mobileNumber: { type: String, required: true },
  personalID: { type: String},
  transaction: [TransactionSchema],
  carsOwned:[CarSchema],
  balance: { type: Number, required: true, default: 0.0 },
  dateAdded:{ type: Date},
  password:{ type: String, required: true }
});

module.exports = mongoose.model("carOwner", CarOwnerSchema);
