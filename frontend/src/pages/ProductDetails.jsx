import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-7xl mx-auto px-4 py-10 text-gray-500">Loading...</p>;
  if (!product) return <p className="max-w-7xl mx-auto px-4 py-10 text-gray-500">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-xs uppercase text-gray-400">{product.category}</span>
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-bold text-brand-accent">${product.price.toFixed(2)}</p>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
        <p className="text-sm text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

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
  );
}
