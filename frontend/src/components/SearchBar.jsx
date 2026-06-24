import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search products or category..."
        className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
      />
      <button
        type="submit"
        className="bg-brand text-white px-4 rounded-r-md text-sm hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}
