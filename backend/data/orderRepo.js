import { nanoid } from "../utils/id.js";
import Order from "../models/Order.js";
import db from "../data/jsonDb.js";

const useMongo = () => process.env.USE_MONGO === "true";

export const OrderRepo = {
  async create(payload) {
    if (useMongo()) return Order.create(payload);
    await db.read();
    db.data.orders ||= [];
    const order = {
      _id: nanoid(),
      ...payload,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db.data.orders.push(order);
    await db.write();
    return order;
  },

  async getAll() {
    if (useMongo()) return Order.find().sort({ createdAt: -1 });
    await db.read();
    db.data.orders ||= [];
    return [...db.data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    if (useMongo()) return Order.findById(id);
    await db.read();
    db.data.orders ||= [];
    return db.data.orders.find((o) => o._id === id) || null;
  },
};
