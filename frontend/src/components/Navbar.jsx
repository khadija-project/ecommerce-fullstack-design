import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import SearchBar from "./SearchBar.jsx";

export default function Navbar() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top row: logo, category select, search, cart/account */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-brand whitespace-nowrap">
          Shop<span className="text-brand-accent">Ease</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-2xl items-stretch">
          <select className="border border-gray-300 border-r-0 rounded-l-md px-2 text-sm text-gray-500 bg-gray-50 focus:outline-none">
            <option>All category</option>
            <option>Footwear</option>
            <option>Bags</option>
            <option>Electronics</option>
            <option>Apparel</option>
            <option>Accessories</option>
          </select>
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className="hover:text-brand-accent">Shop</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-brand-accent">Admin</Link>
          )}
          <Link to="/cart" className="relative hover:text-brand-accent">
            Cart
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-accent text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={() => { logout(); navigate("/"); }} className="hover:text-brand-accent">
              Logout ({user.name.split(" ")[0]})
            </button>
          ) : (
            <Link to="/login" className="hover:text-brand-accent">Login</Link>
          )}
        </nav>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Secondary nav row, like the Figma's "Hot offers / Gift boxes / Projects..." row */}
      <div className="hidden md:block border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-5">
            <Link to="/products" className="hover:text-brand-accent">Hot offers</Link>
            <Link to="/products?category=Bags" className="hover:text-brand-accent">Gift boxes</Link>
            <Link to="/products?category=Electronics" className="hover:text-brand-accent">New arrivals</Link>
            <Link to="/products" className="hover:text-brand-accent">Best sellers</Link>
          </div>
          <span>Ship to: <span className="font-medium text-gray-700">Pakistan</span></span>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
          <SearchBar />
          <Link to="/products" onClick={() => setOpen(false)}>Shop</Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
          )}
          <Link to="/cart" onClick={() => setOpen(false)}>Cart ({totalCount})</Link>
          {user ? (
            <button className="text-left" onClick={() => { logout(); setOpen(false); navigate("/"); }}>
              Logout ({user.name.split(" ")[0]})
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
