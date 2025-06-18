const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  images: [String], // Supports multiple images
  category: {
    type: String,
    enum: ["Events", "Classroom", "Activities"],
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gallery", gallerySchema);
