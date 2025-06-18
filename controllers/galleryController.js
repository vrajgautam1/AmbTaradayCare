const Gallery = require("../models/gallery");
const fs = require("fs");
const path = require("path");

// ✅ Upload Multiple Images
exports.uploadGallery = async (req, res) => {
  try {
    const { category } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const imageFilenames = files.map((file) => file.filename);

    const newGallery = new Gallery({
      images: imageFilenames,
      category,
      isApproved: true, // default approval
    });

    await newGallery.save();
    res.status(201).json({ message: "Gallery uploaded", gallery: newGallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Images by Category + Approval
exports.getGalleryByFilter = async (req, res) => {
  try {
    const { category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status === "approved") filter.isApproved = true;
    else if (status === "disapproved") filter.isApproved = false;

    const gallery = await Gallery.find(filter);
    res.status(200).json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve / Disapprove Image Set
exports.toggleApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ error: "Gallery not found" });

    gallery.isApproved = !gallery.isApproved;
    await gallery.save();
    res.status(200).json({ message: `Gallery ${gallery.isApproved ? "approved" : "disapproved"}`, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Gallery (and images)

exports.deleteImageFromGallery = async (req, res) => {
  try {
    const { id, index } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery document not found" });
    }

    const imageToDelete = gallery.images[index];
    if (!imageToDelete) {
      return res.status(404).json({ error: "No image at this index" });
    }

    // Delete image file from disk
    const imagePath = path.join(__dirname, "../uploads", imageToDelete);
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete image from disk:", err);
    });

    // Remove image from array
    gallery.images.splice(index, 1);
    await gallery.save();

    res.status(200).json({ message: "Image deleted", updatedGallery: gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

