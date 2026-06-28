import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    api.get("/products", { params: { category: product.category } })
      .then((res) => setRelated(res.data.filter((p) => p._id !== product._id).slice(0, 6)))
      .catch(() => setRelated([]));
  }, [product]);

  if (loading) return <p className="max-w-7xl mx-auto px-4 py-10 text-gray-500">Loading...</p>;
  if (!product) return <p className="max-w-7xl mx-auto px-4 py-10 text-gray-500">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-surface">
      {/* Breadcrumb */}
      <p className="text-xs text-gray-400 mb-4">
        <Link to="/" className="hover:text-brand-accent">Home</Link> {" / "}
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-accent">{product.category}</Link> {" / "}
        <span className="text-gray-600">{product.name}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase text-gray-400">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-brand-accent">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Real attributes only — no fake spec fields */}
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
            <div className="flex justify-between px-4 py-2">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between px-4 py-2">
              <span className="text-gray-500">Availability</span>
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Qty</label>
            <input
              type="number"
              min={1}
              max={product.stock || 1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-gray-300 rounded-md px-2 py-1.5"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => addToCart(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 bg-brand text-white py-3 rounded-md font-medium hover:bg-gray-800 disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product, qty); navigate("/cart"); }}
              disabled={product.stock === 0}
              className="flex-1 bg-brand-accent text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-6 border-b border-gray-200 text-sm font-medium">
          {["description", "specifications"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 capitalize ${tab === t ? "text-brand-accent border-b-2 border-brand-accent" : "text-gray-500"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-6 text-gray-600 text-sm leading-relaxed max-w-3xl">
          {tab === "description" ? (
            <p>{product.description}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              <li><span className="font-medium text-gray-800">Category:</span> {product.category}</li>
              <li><span className="font-medium text-gray-800">Price:</span> ${product.price.toFixed(2)}</li>
              <li><span className="font-medium text-gray-800">Stock available:</span> {product.stock}</li>
            </ul>
          )}
        </div>
      </div>

      {/* Related products — real data, same category */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold text-lg mb-4">Related products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Promo banner */}
      <Link
        to="/products"
        className="block mt-10 bg-brand-accent rounded-lg px-6 py-5 text-white flex items-center justify-between hover:bg-blue-700"
      >
        <span className="font-medium">Looking for more? Browse our full catalog.</span>
        <span className="bg-white text-brand-accent text-sm font-semibold px-4 py-2 rounded-md">Shop now</span>
      </Link>
    </div>
  );
}
