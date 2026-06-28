import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If someone lands here directly without an order in state, send them home
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold mb-4">No order found</h1>
        <button onClick={() => navigate("/")} className="bg-brand text-white px-6 py-3 rounded-md font-medium">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Order placed successfully!</h1>
        <p className="text-gray-500">
          Order ID: <span className="font-mono text-gray-700">{order._id}</span>
        </p>
        <p className="text-gray-400 text-sm mt-1">
          This is a demo checkout — no real payment was processed.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3">Shipping to</h2>
        <p className="text-sm text-gray-600">{order.shipping.fullName}</p>
        <p className="text-sm text-gray-600">{order.shipping.address}, {order.shipping.city}</p>
        <p className="text-sm text-gray-600">{order.shipping.phone}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1.5 text-gray-600">
            <span>{item.name} × {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold border-t border-gray-200 mt-3 pt-3">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/products" className="block text-center bg-brand text-white py-3 rounded-md font-medium">
        Continue Shopping
      </Link>
    </div>
  );
}
