const express = require('express');
const router = express.Router();

const inquiryRoutes = require('./admin/inquiryRoutes');
const reviewRoutes = require('./admin/reviewRoutes');
const eventRoutes = require("./admin/eventRouter")
const galleryRouter = require("./admin/galleryRouter");

//admin routes are protected
router.use('/admin', inquiryRoutes);
router.use('/admin', reviewRoutes);
router.use('/admin', eventRoutes)
router.use("/admin", galleryRouter);

module.exports = router;
