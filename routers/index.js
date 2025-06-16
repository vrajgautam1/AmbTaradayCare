const express = require('express');
const router = express.Router();
const inquiryRoutes = require('./admin/inquiryRoutes');

router.use("/admin", inquiryRoutes);

module.exports = router;