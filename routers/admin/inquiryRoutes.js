const express = require('express');
const router = express.Router();
const inquiryController = require('../../controllers/inquiryController');

router.get('/viewinquiries', inquiryController.getAllInquiries);
router.post('/createinquiry', inquiryController.createInquiry);
router.patch('/markAsReadInquiry/:id', inquiryController.markAsRead);
router.delete('/deleteInquiries/:id', inquiryController.deleteInquiry);

module.exports = router;
