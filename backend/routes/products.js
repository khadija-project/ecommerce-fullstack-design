import express from "express";
import { ProductRepo } from "../data/productRepo.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products?search=&category=
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const products = await ProductRepo.getAll({ search, category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/featured
router.get("/featured", async (req, res) => {
  try {
    const products = await ProductRepo.getFeatured();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductRepo.getById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products  (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await ProductRepo.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id  (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await ProductRepo.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id  (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const ok = await ProductRepo.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
