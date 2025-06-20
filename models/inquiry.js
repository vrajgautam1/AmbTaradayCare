const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String }, // ✅ replaced email with phone number
    subject: { type: String },
    message: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inquiry", inquirySchema);
