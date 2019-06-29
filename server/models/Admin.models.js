const mongoose = require("mongoose");
const { Schema } = mongoose;
const AdminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:{ type: String, required: true },
  email:{type: String, required: true},
  password:{ type: String, required: true },
  mobileNumber: { type: String, required: true },
  personalID: { type: String},
  dateAdded:{ type: Date},

});

module.exports = mongoose.model("admin", AdminSchema);
