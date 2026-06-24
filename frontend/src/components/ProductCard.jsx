import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/products/${product._id}`} className="block aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-xs uppercase text-gray-400">{product.category}</span>
        <Link to={`/products/${product._id}`} className="font-medium text-sm hover:text-brand-accent line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-brand">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className="text-xs bg-brand text-white px-3 py-1.5 rounded-md hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of stock" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
