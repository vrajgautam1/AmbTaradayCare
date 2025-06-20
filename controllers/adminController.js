const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Show Login Page
exports.openLoginPage = (req, res) => {
  return res.render("login", { error: null });
};

// 🔐 Admin Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.render("login", { error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "ambtar_secret",
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("Authorization", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Login Error:", err);
    return res.render("login", { error: "Something went wrong. Please try again." });
  }
};

// 🚪 Admin Logout
exports.logout = (req, res) => {
  res.clearCookie("Authorization");
  return res.redirect("/login");
};

// 🔑 Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id); // set by JWT middleware
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Old password incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
