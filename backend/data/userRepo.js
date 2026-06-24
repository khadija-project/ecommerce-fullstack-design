import { nanoid } from "../utils/id.js";
import User from "../models/User.js";
import db from "../data/jsonDb.js";

const useMongo = () => process.env.USE_MONGO === "true";

export const UserRepo = {
  async findByEmail(email) {
    if (useMongo()) return User.findOne({ email });
    await db.read();
    return db.data.users.find((u) => u.email === email) || null;
  },

  async create(payload) {
    if (useMongo()) return User.create(payload);
    await db.read();
    const newUser = { _id: nanoid(), ...payload };
    db.data.users.push(newUser);
    await db.write();
    return newUser;
  },
};
