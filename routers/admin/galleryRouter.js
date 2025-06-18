const express = require("express");
const router = express.Router();
const galleryController = require("../../controllers/galleryController");
const upload = require("../../middleware/multerMiddleWare");

// ✅ Upload gallery with multiple images
router.post("/upload", upload.array("images", 10), galleryController.uploadGallery);

// ✅ View gallery (by category & status)
router.get("/view", galleryController.getGalleryByFilter);

// ✅ Toggle approval (approve/disapprove)
router.patch("/:galleryId/image/:imageId/toggle", galleryController.toggleImageApproval);

// ✅ Delete gallery
router.delete("/:galleryId/image/:imageId", galleryController.deleteSingleImage);


module.exports = router;
