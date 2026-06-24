import dotenv from "dotenv";
import { connectMongo } from "./config/db.js";
import { initJsonDb } from "./data/jsonDb.js";
import { ProductRepo } from "./data/productRepo.js";
import db from "./data/jsonDb.js";

dotenv.config();

// loremflickr.com returns a REAL photo matching the keyword (unlike picsum,
// which just returns a random photo regardless of the "seed" word). The
// trailing /productname is a cache-buster lock so the same product always
// gets the same photo on every reload instead of a new random one each time.
const img = (keyword, lock) =>
  `https://loremflickr.com/400/400/${keyword}?lock=${lock}`;

const sampleProducts = [
  { name: "Classic White Sneakers", price: 59.99, image: img("sneakers,white", 1), description: "Comfortable everyday sneakers with breathable mesh upper.", category: "Footwear", stock: 25, featured: true },
  { name: "Leather Crossbody Bag", price: 89.5, image: img("handbag,leather", 2), description: "Premium leather crossbody bag with adjustable strap.", category: "Bags", stock: 12, featured: true },
  { name: "Wireless Headphones", price: 129.0, image: img("headphones", 3), description: "Noise-cancelling over-ear wireless headphones, 30hr battery.", category: "Electronics", stock: 40, featured: true },
  { name: "Cotton Graphic T-Shirt", price: 24.99, image: img("tshirt", 4), description: "100% organic cotton t-shirt with minimalist print.", category: "Apparel", stock: 60, featured: false },
  { name: "Slim Fit Denim Jeans", price: 49.99, image: img("denim,jeans", 5), description: "Stretch denim slim fit jeans, machine washable.", category: "Apparel", stock: 35, featured: true },
  { name: "Stainless Steel Watch", price: 149.99, image: img("wristwatch", 6), description: "Minimalist stainless steel watch with leather strap.", category: "Accessories", stock: 18, featured: false },
  { name: "Smart Fitness Band", price: 39.99, image: img("fitness,smartwatch", 7), description: "Tracks steps, heart rate, and sleep with 7-day battery.", category: "Electronics", stock: 50, featured: true },
  { name: "Polarized Sunglasses", price: 34.99, image: img("sunglasses", 8), description: "UV400 protection polarized sunglasses, unisex design.", category: "Accessories", stock: 22, featured: false },
  { name: "Running Backpack", price: 64.99, image: img("backpack", 9), description: "Lightweight water-resistant backpack with laptop sleeve.", category: "Bags", stock: 15, featured: false },
  { name: "Bluetooth Speaker", price: 45.0, image: img("speaker,bluetooth", 10), description: "Portable waterproof speaker with 12-hour playback.", category: "Electronics", stock: 30, featured: false },
  { name: "Canvas Low-Top Shoes", price: 39.99, image: img("canvas,shoes", 11), description: "Casual canvas shoes perfect for everyday wear.", category: "Footwear", stock: 28, featured: false },
  { name: "Wool Blend Scarf", price: 19.99, image: img("scarf,wool", 12), description: "Soft wool blend scarf, available in multiple colors.", category: "Accessories", stock: 45, featured: false },
];

const run = async () => {
  if (process.env.USE_MONGO === "true") {
    await connectMongo();
    const Product = (await import("./models/Product.js")).default;
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
  } else {
    await initJsonDb();
    db.data.products = [];
    await db.write();
    for (const p of sampleProducts) {
      await ProductRepo.create(p);
    }
  }
  console.log(`✅ Seeded ${sampleProducts.length} products`);
  process.exit(0);
};

run();
