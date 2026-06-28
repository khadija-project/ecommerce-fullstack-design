// Vercel serverless adapter — exports the same Express app used by server.js
// so deployment doesn't require a persistent process like Render/Heroku do.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "../config/db.js";
import { initJsonDb } from "../data/jsonDb.js";
import productRoutes from "../routes/products.js";
import authRoutes from "../routes/auth.js";
import newsletterRoutes from "../routes/newsletter.js";
import orderRoutes from "../routes/orders.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let initialized = false;
const init = async () => {
  if (initialized) return;
  if (process.env.USE_MONGO === "true") {
    await connectMongo();
  } else {
    await initJsonDb();
  }
  initialized = true;
};

app.use(async (req, res, next) => {
  await init();
  next();
});

app.get("/", (req, res) => res.json({ status: "API running on Vercel" }));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

export default app;
