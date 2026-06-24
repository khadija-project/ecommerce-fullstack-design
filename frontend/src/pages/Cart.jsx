import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, removeFromCart, updateQty, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Browse our products and add something you love.</p>
        <Link to="/products" className="bg-brand text-white px-6 py-3 rounded-md font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) => updateQty(item._id, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-md px-2 py-1.5 text-center"
            />
            <p className="w-20 text-right font-semibold">${(item.price * item.qty).toFixed(2)}</p>
            <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 border-t border-gray-200 pt-6">
        <button onClick={clearCart} className="text-sm text-gray-500 hover:underline">
          Clear Cart
        </button>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <button className="w-full mt-6 bg-brand-accent text-white py-3 rounded-md font-medium hover:bg-blue-700">
        Proceed to Checkout
      </button>
    </div>
  );
}
