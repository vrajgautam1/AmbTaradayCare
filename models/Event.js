const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  isApproved: { type: Boolean, default: true }, //note by default all events are approved. the admin has to remove them if they want to. 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
