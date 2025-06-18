// routers/index.js

const express = require('express');
const router = express.Router();

const inquiryRoutes = require('./admin/inquiryRoutes');
const reviewRoutes = require('./admin/reviewRoutes');
const eventRoutes = require("./admin/eventRouter");
const galleryRouter = require("./admin/galleryRouter");
const authRouter = require("./admin/authRouter");
const authMiddleware = require("../middleware/authMiddleware");

// 🧑‍💼 Unprotected Login routes
router.use("/login", authRouter);

// 🔐 Protect all admin routes from here
router.use("/admin", authMiddleware); // ✅ Protect all /admin routes

router.use("/admin", inquiryRoutes);
router.use("/admin", reviewRoutes);
router.use("/admin", eventRoutes);
router.use("/admin", galleryRouter);

module.exports = router;
