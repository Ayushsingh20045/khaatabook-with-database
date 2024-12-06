const mongoose = require("mongoose");

var userschema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password:{type:String,required:true},
 
 
});

module.exports = mongoose.model("user", userschema);
