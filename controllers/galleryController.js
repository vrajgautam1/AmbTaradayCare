const Gallery = require("../models/gallery");
const fs = require("fs");
const path = require("path");

// ✅ Upload Multiple Images
exports.uploadGallery = async (req, res) => {
  try {
    const { category } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("No images uploaded");
    }

    // 👇 Correct structure for subdocuments
    const imageDocs = files.map((file) => ({
      filename: file.filename,
      isApproved: true,
    }));

    const newGallery = new Gallery({
      images: imageDocs, // 👈 not strings anymore
      category,
    });

    await newGallery.save();

    // ✅ Redirect after success
    res.redirect("/admin/gallery");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error: Unable to upload images");
  }
};


// ✅ Get Images by Category + Approval
exports.getGalleryByFilter = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category) filter.category = category;

    // Filtering based on image approval status
    let galleries = await Gallery.find(filter);

    if (status === 'approved') {
      galleries = galleries.map(g => ({
        ...g.toObject(),
        images: g.images.filter(img => img.isApproved === true)
      }));
    } else if (status === 'disapproved') {
      galleries = galleries.map(g => ({
        ...g.toObject(),
        images: g.images.filter(img => img.isApproved === false)
      }));
    }

    res.render('admin/pages/gallery', {
      gallery: galleries,
      query: req.query // pass to EJS for preselecting filters
    });
  } catch (err) {
    res.status(500).send("Gallery filter error: " + err.message);
  }
};


// ✅ Approve / Disapprove Image Set
// PATCH /gallery/:galleryId/image/:imageId/toggle
exports.toggleImageApproval = async (req, res) => {
  try {
    const { galleryId, index } = req.params;
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) return res.status(404).send("Gallery not found");

    const imgIndex = parseInt(index);
    if (isNaN(imgIndex) || imgIndex >= gallery.images.length) {
      return res.status(400).send("Invalid image index");
    }

    // ✅ Toggle specific image approval status
    gallery.images[imgIndex].isApproved = !gallery.images[imgIndex].isApproved;
    await gallery.save();

    res.redirect("/admin/gallery");
  } catch (err) {
    res.status(500).send("Toggle approval failed: " + err.message);
  }
};


// ✅ Delete Gallery (and images)

// DELETE /gallery/:galleryId/image/:imageId
exports.deleteSingleImage = async (req, res) => {
  try {
    const { galleryId, index } = req.params;
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) return res.status(404).send("Gallery not found");

    const imgIndex = parseInt(index);
    if (isNaN(imgIndex) || imgIndex >= gallery.images.length) {
      return res.status(400).send("Invalid image index");
    }

    const filename = gallery.images[imgIndex].filename; // ✅ fix here
    const imagePath = path.join(__dirname, "../uploads", filename);

    // Delete file from disk
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting image:", err);
    });

    // Remove from DB
    gallery.images.splice(imgIndex, 1);
    await gallery.save();

    res.redirect("/admin/gallery");
  } catch (err) {
    res.status(500).send("Error deleting image: " + err.message);
  }
};

