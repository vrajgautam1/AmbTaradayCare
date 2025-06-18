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
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve or reject a review
exports.setApproval = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review approved successfully", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.disapproveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review disapproved successfully", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

// ✅ Get approved reviews only (for homepage)
exports.getApprovedReviews = async (req, res) => {
  try {
    const approved = await Review.find({ isApproved: true });
    res.status(200).json(approved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getdisapprovedReviews = async(req, res)=>{
  try {
    let disapprovedReviews = await Review.find({isApproved: false});
    res.status(200).json(disapprovedReviews)
  } catch (error) {
    res.status(500).json({error: err.message})
  }
}