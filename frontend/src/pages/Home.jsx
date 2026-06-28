import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORY_TILES = [
  { name: "Footwear", icon: "👟" },
  { name: "Bags", icon: "👜" },
  { name: "Electronics", icon: "🎧" },
  { name: "Apparel", icon: "👕" },
  { name: "Accessories", icon: "🕶️" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/featured")
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-start gap-4">
          <h1 className="text-3xl md:text-5xl font-bold max-w-xl">
            Everyday essentials, delivered fast.
          </h1>
          <p className="text-gray-300 max-w-md">
            Discover curated apparel, electronics, and accessories at honest prices.
          </p>
          <Link
            to="/products"
            className="bg-brand-accent hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl py-6 hover:border-brand-accent hover:shadow-sm transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-brand-accent text-sm font-medium hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : featured.length === 0 ? (
          <p className="text-gray-500">No featured products yet. Run the seed script.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
