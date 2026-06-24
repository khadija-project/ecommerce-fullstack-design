import { useEffect, useState } from "react";
import api from "../api/api.js";

const emptyForm = { name: "", price: "", image: "", description: "", category: "", stock: "", featured: false };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = () => {
    api.get("/products").then((res) => setProducts(res.data));
  };

  useEffect(() => { loadProducts(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
      featured: !!product.featured,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3 h-fit">
        <h2 className="font-bold text-lg">{editingId ? "Edit Product" : "Add Product"}</h2>
        {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2">{error}</p>}

        <input required placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2" />
        <input required type="number" step="0.01" placeholder="Price" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2" />
        <input required placeholder="Image URL" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2" />
        <textarea required placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2" rows={3} />
        <input required placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2" />
        <input required type="number" placeholder="Stock" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured on homepage
        </label>

        <div className="flex gap-2 mt-2">
          <button className="flex-1 bg-brand text-white py-2 rounded-md font-medium hover:bg-gray-800">
            {editingId ? "Update" : "Add"} Product
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 border border-gray-300 rounded-md">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      <div className="lg:col-span-2">
        <h2 className="font-bold text-lg mb-4">All Products ({products.length})</h2>
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category} · Stock: {p.stock}</p>
              </div>
              <span className="font-semibold">${p.price.toFixed(2)}</span>
              <button onClick={() => handleEdit(p)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
