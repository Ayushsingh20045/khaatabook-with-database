const mongoose = require("mongoose");

const hisaabSchema = mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
});

module.exports = mongoose.model("Hisaab", hisaabSchema);
