const express = require("express");
const router = express.Router();
const galleryController = require("../../controllers/galleryController");
const upload = require("../../middleware/multerMiddleWare");

// ✅ Upload gallery with multiple images
router.post("/upload", upload.array("images", 10), galleryController.uploadGallery);

router.get("/gallery", galleryController.getGalleryByFilter);

router.get("/gallery/:galleryId/image/:index/toggle", galleryController.toggleImageApproval);

router.get("/gallery/:galleryId/image/:index", galleryController.deleteSingleImage);



module.exports = router;
