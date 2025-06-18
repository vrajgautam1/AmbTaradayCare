const express = require('express');
const router = express.Router();

const inquiryRoutes = require('./admin/inquiryRoutes');
const reviewRoutes = require('./admin/reviewRoutes');
const eventRoutes = require("./admin/eventRouter")

router.use('/admin', inquiryRoutes);
router.use('/admin', reviewRoutes);
router.use('/events', eventRoutes)

module.exports = router;
