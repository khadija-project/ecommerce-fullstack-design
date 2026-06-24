import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Footwear", "Bags", "Electronics", "Apparel", "Accessories"];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;

    api.get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "All") next.delete("category");
    else next.set("category", cat);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">All Products</h1>
      {search && <p className="text-gray-500 mb-4">Showing results for "{search}"</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-sm px-4 py-1.5 rounded-full border ${
              category === cat
                ? "bg-brand text-white border-brand"
                : "border-gray-300 text-gray-600 hover:border-brand"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
