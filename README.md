# ShopEase — Full-Stack eCommerce (Internship Project)

A complete MERN-style eCommerce app: React (Vite) + Tailwind frontend, Node/Express backend,
JWT auth, cart, and an admin CRUD panel. Works out of the box with a built-in JSON database,
and upgrades to MongoDB with a one-line config change.

```
ecommerce-fullstack-design/
├── backend/      Express API (auth, products, admin)
└── frontend/     React app (Home, Listing, Details, Cart, Login, Admin)
```

---

## 1. Prerequisites

- Node.js 18+ and npm — https://nodejs.org
- Git + a GitHub account
- (Optional, for real MongoDB) a free cluster at https://www.mongodb.com/atlas

---

## 2. Run it locally (5 minutes)

### Backend

```bash
cd backend
cp .env.example .env        # leave USE_MONGO=false to use the built-in JSON DB
npm install
npm run seed                 # loads 12 sample products
npm run dev                  # starts API on http://localhost:5000
```

### Frontend (in a second terminal)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                  # starts app on http://localhost:5173
```

Open **http://localhost:5173**. You should see the homepage with featured products.

### Create your admin account

1. Open `backend/.env` and set `FIRST_ADMIN_EMAIL=you@example.com`.
2. Sign up on the site using that exact email — that account is auto-promoted to `admin`.
3. Log in → an **Admin** link appears in the navbar → add/edit/delete products there.

---

## 3. Switching to real MongoDB

1. Create a free cluster on MongoDB Atlas, get your connection string.
2. In `backend/.env`:
   ```
   USE_MONGO=true
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/ecommerce
   ```
3. Re-run `npm run seed` then `npm run dev`. No other code changes needed — the
   `ProductRepo`/`UserRepo` abstraction layer switches storage automatically.

---

## 4. How this maps to your weekly milestones

### Week 1 — Project setup & static frontend
- Vite + React scaffolding (`frontend/`), Express scaffolding (`backend/`).
- Pages built responsive-first with Tailwind (mobile grid → desktop grid via
  `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, and a hamburger menu under `md`):
  - `Home.jsx`, `ProductListing.jsx`, `ProductDetails.jsx`, `Cart.jsx`
- **To match your Figma file**: swap colors/fonts in `tailwind.config` (inside
  `index.html`), and adjust spacing/layout per component — the structure is
  already in place, so this is a styling pass, not a rebuild.
- Push to GitHub repo named `ecommerce-fullstack-design` (see §6).

### Week 2 — Backend & dynamic integration
- MongoDB-ready `Product` model (`backend/models/Product.js`) with
  `id, name, price, image, description, category, stock`.
- REST API: `GET/POST/PUT/DELETE /api/products`, `GET /api/products/featured`,
  `GET /api/products/:id` — see `backend/routes/products.js`.
- `npm run seed` populates sample data.
- Frontend fetches via Axios (`frontend/src/api/api.js`) into Home, Listing,
  Details, and Cart pages.
- Search bar (`SearchBar.jsx`) filters by name/category via `?search=` query param,
  handled server-side in `ProductRepo.getAll`.

### Week 3 — Auth, cart, admin, deployment
- JWT auth: `backend/routes/auth.js` + `middleware/auth.js` (`protect`, `adminOnly`).
- Admin-protected routes on the API, and a `ProtectedRoute` wrapper on the frontend.
- Cart persists in `localStorage` via `CartContext.jsx` (swap for a backend
  `/api/cart` endpoint per user if you want server-side persistence).
- Admin panel: `frontend/src/pages/Admin.jsx` — add/edit/delete products.
- Responsive testing: resize the browser or use DevTools device mode; the
  Tailwind breakpoints (`sm`, `md`, `lg`) already cover phone/tablet/desktop.
- Deployment: see §7.

---

## 5. API reference

| Method | Endpoint                  | Auth        | Description                  |
|--------|----------------------------|-------------|-------------------------------|
| GET    | /api/products               | Public      | List products (`?search=&category=`) |
| GET    | /api/products/featured      | Public      | Featured products for Home   |
| GET    | /api/products/:id           | Public      | Single product details       |
| POST   | /api/products                | Admin only | Create product               |
| PUT    | /api/products/:id            | Admin only | Update product               |
| DELETE | /api/products/:id            | Admin only | Delete product               |
| POST   | /api/auth/signup             | Public      | Register, returns JWT        |
| POST   | /api/auth/login              | Public      | Login, returns JWT           |

Admin routes require header: `Authorization: Bearer <token>`.

---

## 6. Push to GitHub

```bash
cd ecommerce-fullstack-design
git init
git add .
git commit -m "Initial full-stack eCommerce setup"
git branch -M main
git remote add origin https://github.com/<your-username>/ecommerce-fullstack-design.git
git push -u origin main
```

Commit again at the end of each week so your history shows progress
(Week 1 static pages → Week 2 backend integration → Week 3 auth/admin/deploy).

---

## 7. Deployment

**Backend → Render**
1. Push code to GitHub.
2. New → Web Service on render.com, connect the repo, root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from your `.env` (`USE_MONGO`, `MONGO_URI`, `JWT_SECRET`, `FIRST_ADMIN_EMAIL`).
5. Deploy — note the live URL (e.g. `https://shopease-api.onrender.com`).

**Frontend → Vercel**
1. Import the GitHub repo on vercel.com, set root directory to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
3. Add env var `VITE_API_URL=https://shopease-api.onrender.com/api`.
4. Deploy — you get a live URL to submit as your final deliverable.

For MongoDB in production, use MongoDB Atlas (set `USE_MONGO=true` + `MONGO_URI`
in Render's environment settings) instead of the JSON file store.

---

## 8. Next improvements (optional, for extra credit)
- Move cart to a backend `/api/cart` collection keyed by user id, for cross-device sync.
- Add product image upload (Cloudinary/S3) instead of pasting URLs in the admin form.
- Add pagination to `/api/products` for large catalogs.
- Add order/checkout flow and a simple payment integration (Stripe test mode).
