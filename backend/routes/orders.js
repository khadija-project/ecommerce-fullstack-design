import express from "express";
import { OrderRepo } from "../data/orderRepo.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders — place an order (public, no login required, matches a real guest checkout)
router.post("/", async (req, res) => {
  try {
    const { items, shipping, total } = req.body;
    if (!items?.length || !shipping || total === undefined) {
      return res.status(400).json({ message: "Missing order details" });
    }
    const { fullName, address, city, phone } = shipping;
    if (!fullName || !address || !city || !phone) {
      return res.status(400).json({ message: "All shipping fields are required" });
    }
    const order = await OrderRepo.create({ items, shipping, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders — admin only, view all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await OrderRepo.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id — used by the confirmation page to show order details
router.get("/:id", async (req, res) => {
  try {
    const order = await OrderRepo.getById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
