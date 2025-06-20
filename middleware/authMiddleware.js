const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ambtara_secret");
    req.admin = decoded; // example: { id, username }
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
