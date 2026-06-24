import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/db.js";
import { initJsonDb } from "./data/jsonDb.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Storage mode bootstrap
if (process.env.USE_MONGO === "true") {
  connectMongo();
} else {
  initJsonDb();
}

app.get("/", (req, res) => res.json({ status: "API running" }));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
