const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  carRenterID: { type: mongoose.Schema.ObjectId },
  carID: { type: mongoose.Schema.ObjectId, required: true },
  carOwnerID: { type: mongoose.Schema.ObjectId, required: true },
  rentingDateStart: { type: Date, required: true },
  rentingDateEnd: { type: Date, required: true },
  offeredDate: { type: Date },
  status: {
    type: String,
    enum: ["Done","Booked", "In process", "Upcoming"],
    default: "Upcoming"
  },
  carRating: { type: Number },
  renterRating: { type: Number },
  ownerRating: { type: Number },
  price: { type: Number, required: true },
  minimumPeriod:{ type: Number, required: true },
  location:{type:String,required:true},
});
module.exports = mongoose.model("transaction", TransactionSchema);
