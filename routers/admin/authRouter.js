// routers/admin/authRouter.js

const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");

router.get("/login", adminController.openLoginPage)
// 🧑‍💼 Login route (unprotected)
router.post("/login", adminController.login);

// 🔒 Change password (already protected from index.js)
router.put("/changepassword", adminController.changePassword);

// 🔒 Logout (also already protected)
router.post("/logout", adminController.logout);

module.exports = router;
