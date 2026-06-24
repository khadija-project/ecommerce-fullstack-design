import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email" required placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="password" required placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <button className="bg-brand text-white py-3 rounded-md font-medium hover:bg-gray-800">
          Log In
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Don't have an account? <Link to="/signup" className="text-brand-accent hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
