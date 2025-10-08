import jwt from "jsonwebtoken";
import { store } from "../store/index.js";

export const protect = async (req, res, next) => {
  try {
    console.log("Auth headers:", req.headers.authorization);
    if (!req.headers.authorization?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("Extracted token:", token);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const user = store.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const faculty = (req, res, next) => {
  if (req.user && req.user.role === "FACULTY") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as faculty" });
  }
};

export const student = (req, res, next) => {
  if (req.user && req.user.role === "STUDENT") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as student" });
  }
};
