import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";

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
