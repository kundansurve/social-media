const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  followers:{
    type:Array,
    default:[]
  },
  following:{
    type:Array,
    default:[]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", User);
