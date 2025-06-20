const Review = require('../models/reviews');

// ✅ Create a review (submitted by parent)
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ View all reviews (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render("admin/pages/reviews", { reviews, filter: "all" });
  } catch (err) {
    res.status(500).send("Error loading reviews");
  }
};

// ✅ Approve or reject a review
exports.setApproval = async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.redirect("/admin/viewreviews"); // ✅ redirect to reviews page
  } catch (err) {
    res.status(400).send("Approval failed");
  }
};

exports.disapproveReview = async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { isApproved: false });
    res.redirect("/admin/viewreviews"); // ✅ redirect
  } catch (err) {
    res.status(400).send("Disapproval failed");
  }
};


exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect("/admin/viewreviews");
  } catch (err) {
    res.status(500).send("Error deleting review");
  }
};



// ✅ Get approved reviews only (for homepage)
exports.renderApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.render("admin/pages/reviews", { reviews, filter: "approved" });
  } catch (err) {
    res.status(500).send("Error loading approved reviews");
  }
};

// Disapproved Reviews
exports.renderDisapprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).sort({ createdAt: -1 });
    res.render("admin/pages/reviews", { reviews, filter: "disapproved" });
  } catch (err) {
    res.status(500).send("Error loading disapproved reviews");
  }
};


// ✅ Edit review before approval
exports.editReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


