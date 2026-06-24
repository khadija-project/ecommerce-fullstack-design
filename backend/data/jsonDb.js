import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "db.json");

const adapter = new JSONFile(file);
const db = new Low(adapter, { products: [], users: [] });

export const initJsonDb = async () => {
  await db.read();
  db.data ||= { products: [], users: [] };
  await db.write();
  console.log("✅ JSON file database ready (USE_MONGO=false)");
  return db;
};

export default db;
