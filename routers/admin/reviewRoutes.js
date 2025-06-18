const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');

// Parent submits review
router.post('/createreview', reviewController.createReview);

// Admin views all reviews
router.get('/viewreviews', reviewController.getAllReviews);

// Admin approves/rejects a review
router.patch('/review/:id/approval', reviewController.setApproval);

router.patch('/review/:id/disapprove', reviewController.disapproveReview);

// Admin edits review
router.put('/review/:id/edit', reviewController.editReview);

// Homepage fetches only approved reviews
router.get('/approvedreviews', reviewController.getApprovedReviews);

router.get('/disapprovedReviews', reviewController.getdisapprovedReviews);

module.exports = router;
