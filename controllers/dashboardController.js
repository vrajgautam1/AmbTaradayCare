const Inquiry = require("../models/inquiry")
const Review = require("../models/reviews")
const Gallery = require("../models/gallery")
const Event = require("../models/Event")


exports.renderDashboard = async (req, res) => {
  try {
    const today = new Date();

    const [totalInquiries, totalReviews, approvedReviews, pendingReviews,
      totalEvents, upcomingEvents, pastEvents,
      galleryCountRaw, approvedAlbums, disapprovedAlbums,
      recentInquiries, recentReviews, upcomingEventList, recentAlbums] = await Promise.all([
        Inquiry.countDocuments(),
        Review.countDocuments(),
        Review.countDocuments({ isApproved: true }),
        Review.countDocuments({ isApproved: false }),
        Event.countDocuments(),
        Event.countDocuments({ date: { $gte: today } }),
        Event.countDocuments({ date: { $lt: today } }),
        Gallery.aggregate([{ $unwind: "$images" }, { $count: "total" }]),
        Gallery.countDocuments({ isApproved: true }),
        Gallery.countDocuments({ isApproved: false }),
        Inquiry.find().sort({ createdAt: -1 }).limit(5),
        Review.find({ isApproved: false }).sort({ createdAt: -1 }).limit(5),
        Event.find({ date: { $gte: today } }).sort({ date: 1 }).limit(5),
        Gallery.find().sort({ createdAt: -1 }).limit(3)
    ]);

    const totalGalleryImages = galleryCountRaw[0] ? galleryCountRaw[0].total : 0;

    res.render("admin/pages/dashboard.ejs", {
      totalInquiries,
      totalReviews,
      approvedReviews,
      pendingReviews,
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalGalleryImages,
      approvedAlbums,
      disapprovedAlbums,
      recentInquiries,
      recentReviews,
      upcomingEventList,
      recentAlbums
    });
  } catch (err) {
    res.status(500).send("Dashboard error: " + err.message);
  }
};
