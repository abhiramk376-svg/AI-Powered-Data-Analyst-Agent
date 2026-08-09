const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Authentication middleware - verifies JWT from Authorization header or cookie
const authenticate = (req, res, next) => {
  // Try to read token from Authorization header: "Bearer <token>"
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  let token = null;

  if (authHeader && typeof authHeader === "string") {
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // header present but not prefixed with Bearer - treat whole header as token
      token = authHeader;
    }
  }

  // Fallback: token may be stored in cookies (requires cookie-parser)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Access denied: no token provided" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set in environment variables.");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal user info to request for downstream handlers
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
