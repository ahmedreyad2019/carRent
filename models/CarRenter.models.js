const mongoose = require("mongoose");
const { Schema } = mongoose;
const CarRenterSchema = new Schema({
  name: { type: String }
});

module.exports = mongoose.model("carRenter", CarRenterSchema);
