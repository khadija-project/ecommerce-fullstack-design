import { useEffect, useState } from "react";
import api from "../api/api.js";

const emptyForm = { name: "", price: "", image: "", description: "", category: "", stock: "", featured: false };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = () => {
    api.get("/products").then((res) => setProducts(res.data));
  };

  const loadOrders = () => {
    api.get("/orders").then((res) => setOrders(res.data)).catch(() => setOrders([]));
  };

  useEffect(() => { loadProducts(); loadOrders(); }, []);

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
    // The form lives at the top of the page — without this, editing a
    // product further down the list looks like nothing happened.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6 border-b border-gray-200 mb-6 text-sm font-medium">
        <button
          onClick={() => setTab("products")}
          className={`pb-3 ${tab === "products" ? "text-brand-accent border-b-2 border-brand-accent" : "text-gray-500"}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`pb-3 ${tab === "orders" ? "text-brand-accent border-b-2 border-brand-accent" : "text-gray-500"}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {tab === "orders" ? (
        <div className="flex flex-col gap-3">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders placed yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-gray-400">#{order._id}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 capitalize">
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium">{order.shipping?.fullName}</p>
                <p className="text-sm text-gray-500">{order.shipping?.address}, {order.shipping?.city} · {order.shipping?.phone}</p>
                <div className="mt-2 text-sm text-gray-600">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name} × {item.qty}</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t border-gray-100 mt-2 pt-2">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
      <div className="grid lg:grid-cols-3 gap-8">
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
      )}
    </div>
  );
}
