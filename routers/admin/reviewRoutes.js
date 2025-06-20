const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');

// Parent submits review
router.post('/createreview', reviewController.createReview);

// Admin views all reviews
router.get('/viewreviews', reviewController.getAllReviews);

// Admin approves/rejects a review
router.get('/approveReview/:id', reviewController.setApproval);

router.get('/disapproveReview/:id', reviewController.disapproveReview);

router.get("/deleteReview/:id", reviewController.deleteReview);

// Admin edits review
router.put('/review/:id/edit', reviewController.editReview);

// Homepage fetches only approved reviews
router.get("/reviews/approved", reviewController.renderApprovedReviews);
router.get("/reviews/disapproved", reviewController.renderDisapprovedReviews);



module.exports = router;
