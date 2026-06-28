import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/api.js";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: "", address: "", city: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <Link to="/products" className="bg-brand text-white px-6 py-3 rounded-md font-medium inline-block mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.image,
        })),
        shipping: form,
        total: totalPrice,
        userEmail: user?.email || null,
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate("/order-confirmation", { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-surface">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
          <h2 className="font-semibold">Shipping Details</h2>
          {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2">{error}</p>}

          <input required placeholder="Full Name" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2" />
          <input required placeholder="Street Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2" />
          <div className="flex gap-3">
            <input required placeholder="City" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
            <input required placeholder="Phone Number" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
          </div>

          <p className="text-xs text-gray-400">
            This is a demo checkout — no real payment is processed. Your order will be saved
            so you can show it during your project demo.
          </p>

          <button disabled={submitting} className="bg-brand-accent text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-60">
            {submitting ? "Placing order..." : `Place Order — $${totalPrice.toFixed(2)}`}
          </button>
        </form>

        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            {items.map((i) => (
              <div key={i._id} className="flex justify-between text-sm py-1.5 text-gray-600">
                <span className="line-clamp-1 pr-2">{i.name} × {i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t border-gray-200 mt-3 pt-3">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
