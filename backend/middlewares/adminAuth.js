const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // update path if needed

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = adminAuth;
