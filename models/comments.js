const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = new Schema({
  commentedBy: {
    type: String,
    required: true
  },
  onPost:{
    type:String,
    required: true
  },
  comment:{
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("comment", Comment);