const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  votes: {
    type: Number,
    default: 0
  }
});

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  options: [optionSchema],
  sessionCode: {
    type: String,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timer: {
    type: Number,  // Duration in minutes
    default: null
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("Poll", pollSchema);