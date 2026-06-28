import express from "express";
import { SubscriberRepo } from "../data/subscriberRepo.js";

const router = express.Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }
    const already = await SubscriberRepo.exists(email);
    if (already) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }
    await SubscriberRepo.create(email);
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
