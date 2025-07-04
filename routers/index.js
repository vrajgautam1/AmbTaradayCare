// routers/index.js

const express = require('express');
const router = express.Router();

const inquiryRoutes = require('./admin/inquiryRoutes');
const reviewRoutes = require('./admin/reviewRoutes');
const eventRoutes = require("./admin/eventRouter");
const galleryRouter = require("./admin/galleryRouter");
const authRouter = require("./admin/authRouter");
const dashboardRouter = require("./admin/dashboardRouter")
const authMiddleware = require("../middleware/authMiddleware");
const clientController = require("../controllers/clientController")

router.get("/", clientController.OpenClientPage)

// 🧑‍💼 Unprotected Login routes
router.use(authRouter);

// 🔐 Protect all admin routes from here
// router.use("/admin", authMiddleware); // ✅ Protect all /admin routes

router.use("/admin", inquiryRoutes);
router.use("/admin", reviewRoutes);
router.use("/admin", eventRoutes);
router.use("/admin", galleryRouter);
router.use("/admin", dashboardRouter);

module.exports = router;
