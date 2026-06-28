import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["Footwear", "Bags", "Electronics", "Apparel", "Accessories"];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [priceForm, setPriceForm] = useState({ min: minPrice, max: maxPrice });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api.get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice]);

  const toggleCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (category === cat) next.delete("category");
    else next.set("category", cat);
    setSearchParams(next);
  };

  const applyPriceRange = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (priceForm.min) next.set("minPrice", priceForm.min); else next.delete("minPrice");
    if (priceForm.max) next.set("maxPrice", priceForm.max); else next.delete("maxPrice");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setPriceForm({ min: "", max: "" });
    setSearchParams(search ? { search } : {});
  };

  const hasActiveFilters = category || minPrice || maxPrice;

  const FilterSidebar = () => (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={category === cat}
                onChange={() => toggleCategory(cat)}
                className="rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-5">
        <h3 className="font-semibold text-sm mb-3">Price range</h3>
        <form onSubmit={applyPriceRange} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number" min="0" placeholder="Min"
              value={priceForm.min}
              onChange={(e) => setPriceForm({ ...priceForm, min: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number" min="0" placeholder="Max"
              value={priceForm.max}
              onChange={(e) => setPriceForm({ ...priceForm, max: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            />
          </div>
          <button className="bg-brand text-white text-sm py-1.5 rounded-md hover:bg-gray-800">
            Apply
          </button>
        </form>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-sm text-brand-accent hover:underline text-left">
          Clear all filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-surface">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">All Products</h1>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden text-sm border border-gray-300 rounded-md px-3 py-1.5"
        >
          {filtersOpen ? "Hide Filters" : "Filters"}
        </button>
      </div>
      {search && <p className="text-gray-500 mb-4">Showing results for "{search}"</p>}
      {!loading && <p className="text-gray-400 text-sm mb-6">{products.length} items found</p>}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <FilterSidebar />
        </div>

        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
