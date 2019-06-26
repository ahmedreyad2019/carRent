const mongoose = require("mongoose");
const { Schema } = mongoose;
const HistorySchema = new Schema({
  carRenterId: { type: String, required: true },
  carId: { type: String, required: true },
  carOwnerId: { type: String, required: true },
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
module.exports = mongoose.model("history", HistorySchema);
