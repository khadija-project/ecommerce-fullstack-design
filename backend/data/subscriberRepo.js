import { nanoid } from "../utils/id.js";
import Subscriber from "../models/Subscriber.js";
import db from "../data/jsonDb.js";

const useMongo = () => process.env.USE_MONGO === "true";

export const SubscriberRepo = {
  async exists(email) {
    if (useMongo()) return !!(await Subscriber.findOne({ email }));
    await db.read();
    db.data.subscribers ||= [];
    return db.data.subscribers.some((s) => s.email === email);
  },

  async create(email) {
    if (useMongo()) return Subscriber.create({ email });
    await db.read();
    db.data.subscribers ||= [];
    const sub = { _id: nanoid(), email, createdAt: new Date().toISOString() };
    db.data.subscribers.push(sub);
    await db.write();
    return sub;
  },
};
