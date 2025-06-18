const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  isApproved: { type: Boolean, default: true },
}, { _id: true }); // ensures each image has its own _id

const gallerySchema = new mongoose.Schema({
  images: [imageSchema],
  category: {
    type: String,
    enum: ["Events", "Classroom", "Activities"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gallery", gallerySchema);
