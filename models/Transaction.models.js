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
  carRating: { type: Number},
  renterRating: { type: Number},
  ownerRating: { type: Number},
  price: { type: Number,required:true}
});
module.exports = mongoose.model("transaction", TransactionSchema);
