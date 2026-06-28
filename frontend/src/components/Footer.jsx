import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const { data } = await api.post("/newsletter/subscribe", { email });
      setStatus({ type: "success", message: data.message });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-brand text-gray-300">
      {/* Newsletter bar */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold text-lg">Subscribe to our newsletter</h3>
            <p className="text-sm text-gray-400">Get daily news on upcoming offers from many suppliers all over the world.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 rounded-l-md text-sm text-gray-900 w-full md:w-64 focus:outline-none"
            />
            <button
              disabled={submitting}
              className="bg-brand-accent hover:bg-blue-700 text-white text-sm px-5 rounded-r-md whitespace-nowrap disabled:opacity-60"
            >
              {submitting ? "..." : "Subscribe"}
            </button>
          </form>
          {status && (
            <p className={`text-xs ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {status.message}
            </p>
          )}
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
        <div>
          <h4 className="text-white font-semibold mb-3">About</h4>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><Link to="/" className="hover:text-white">About Us</Link></li>
            <li><Link to="/" className="hover:text-white">Find Store</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><Link to="/products?category=Footwear" className="hover:text-white">Footwear</Link></li>
            <li><Link to="/products?category=Electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/products?category=Apparel" className="hover:text-white">Apparel</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Help Center</h4>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><Link to="/" className="hover:text-white">Money Refund</Link></li>
            <li><Link to="/" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Users</h4>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white">Register</Link></li>
            <li><Link to="/cart" className="hover:text-white">My Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Get App</h4>
          <div className="flex flex-col gap-2">
            <span className="border border-gray-600 rounded-md px-3 py-2 text-center text-xs text-gray-300">App Store</span>
            <span className="border border-gray-600 rounded-md px-3 py-2 text-center text-xs text-gray-300">Google Play</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-xs text-gray-500 py-4">
        © 2026 ShopEase — Internship Project
      </div>
    </footer>
  );
}
