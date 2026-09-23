import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Missing token", code: "NO_TOKEN" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, email }
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token", code: "BAD_TOKEN" });
  }
}
