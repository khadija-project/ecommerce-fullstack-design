import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepo } from "../data/userRepo.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await UserRepo.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    // First ever account becomes admin automatically for convenience in dev/demo
    const role = email === process.env.FIRST_ADMIN_EMAIL ? "admin" : "customer";
    const user = await UserRepo.create({ name, email, password: hashed, role });
    res.status(201).json({ token: signToken(user), user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserRepo.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: signToken(user), user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
