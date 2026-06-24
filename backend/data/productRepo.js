import { nanoid } from "../utils/id.js";
import Product from "../models/Product.js";
import db from "../data/jsonDb.js";

const useMongo = () => process.env.USE_MONGO === "true";

export const ProductRepo = {
  async getAll({ search, category } = {}) {
    if (useMongo()) {
      const query = {};
      if (category) query.category = category;
      if (search) query.name = { $regex: search, $options: "i" };
      return Product.find(query).sort({ createdAt: -1 });
    }
    await db.read();
    let items = db.data.products;
    if (category) items = items.filter((p) => p.category === category);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
      );
    }
    return items;
  },

  async getFeatured() {
    if (useMongo()) return Product.find({ featured: true }).limit(8);
    await db.read();
    return db.data.products.filter((p) => p.featured);
  },

  async getById(id) {
    if (useMongo()) return Product.findById(id);
    await db.read();
    return db.data.products.find((p) => p._id === id) || null;
  },

  async create(payload) {
    if (useMongo()) return Product.create(payload);
    await db.read();
    const newProduct = { _id: nanoid(), ...payload };
    db.data.products.push(newProduct);
    await db.write();
    return newProduct;
  },

  async update(id, payload) {
    if (useMongo()) return Product.findByIdAndUpdate(id, payload, { new: true });
    await db.read();
    const idx = db.data.products.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    db.data.products[idx] = { ...db.data.products[idx], ...payload };
    await db.write();
    return db.data.products[idx];
  },

  async remove(id) {
    if (useMongo()) return Product.findByIdAndDelete(id);
    await db.read();
    const before = db.data.products.length;
    db.data.products = db.data.products.filter((p) => p._id !== id);
    await db.write();
    return db.data.products.length < before;
  },
};
