const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String},
    subject: { type: String},
    message: { type: String},
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inquiry", inquirySchema);