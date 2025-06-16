const Inquiry = require("../models/inquiry");

// GET all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        console.log("Fetched inquiries:", inquiries);
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        await inquiry.save();
        res.status(201).json(inquiry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PATCH - mark as read
exports.markAsRead = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        console.log("Marked inquiry as read:", inquiry);
        res.json(inquiry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE - remove entry
exports.deleteInquiry = async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        console.log("Deleted inquiry:", req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};