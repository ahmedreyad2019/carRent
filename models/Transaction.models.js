const mongoose = require("mongoose");
const { Schema } = mongoose;


const TransactionSchema = new Schema({
  carRenterID: { type: String },
  carID: { type: String, required: true },
  carOwnerID: { type: String, required: true },
  rentingDateStart: { type: Date, required: true },
  rentingDateEnd: { type: Date, required: true },
  offeredDate: { type: Date },
  status: {
    type: String,
    enum: ["Done", "In process", "Upcoming"],
    default: "Upcoming"
  },
  carRating: { type: Number, required: true, default: 5.0 },
  renterRating: { type: Number, required: true, default: 5.0 },
  ownerRating: { type: Number, required: true, default: 5.0 },
  price: { type: Number }
});
module.exports = mongoose.model("transaction", TransactionSchema);
