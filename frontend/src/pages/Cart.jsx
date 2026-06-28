import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const navigate = useNavigate();
  const {
    items, removeFromCart, updateQty, totalPrice, clearCart,
    savedForLater, saveForLater, moveToCart, removeFromSaved,
  } = useCart();

  if (items.length === 0 && savedForLater.length === 0) {
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
    <div className="max-w-6xl mx-auto px-4 py-8 bg-surface">
      <h1 className="text-2xl font-bold mb-6">My Cart ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty. Items you save for later appear below.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <button onClick={() => saveForLater(item._id)} className="text-brand-accent hover:underline">
                      Save for later
                    </button>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => updateQty(item._id, Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded-md px-2 py-1.5 text-center"
                />
                <p className="w-20 text-right font-semibold">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))
          )}

          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm text-gray-500 hover:underline self-start">
              Clear Cart
            </button>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mb-4">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              disabled={items.length === 0}
              className="w-full bg-brand-accent text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Saved for later */}
      {savedForLater.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold text-lg mb-4">Saved for later ({savedForLater.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {savedForLater.map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
                <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-md" />
                <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                <div className="flex gap-3 text-xs">
                  <button onClick={() => moveToCart(item._id)} className="text-brand-accent hover:underline">
                    Move to cart
                  </button>
                  <button onClick={() => removeFromSaved(item._id)} className="text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
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
