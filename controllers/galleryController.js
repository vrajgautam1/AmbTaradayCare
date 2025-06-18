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
// PATCH /gallery/:galleryId/image/:imageId/toggle
exports.toggleImageApproval = async (req, res) => {
  try {
    const { galleryId, imageId } = req.params;

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const image = gallery.images.id(imageId);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    image.isApproved = !image.isApproved;
    await gallery.save();

    res.status(200).json({
      message: `Image has been ${image.isApproved ? "approved" : "disapproved"}`,
      image,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ Delete Gallery (and images)

// DELETE /gallery/:galleryId/image/:imageId
exports.deleteSingleImage = async (req, res) => {
  try {
    const { galleryId, imageId } = req.params;

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) return res.status(404).json({ error: "Gallery not found" });

    const image = gallery.images.id(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Remove file from filesystem
    const fs = require("fs");
    const path = require("path");
    const imagePath = path.join(__dirname, "../uploads", image.filename);
    fs.unlink(imagePath, err => {
      if (err) console.error("Error deleting file:", err);
    });

    // Remove from DB
    image.remove();
    await gallery.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

