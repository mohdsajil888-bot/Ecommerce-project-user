# Lindt E-commerce + Admin Panel

This project contains the existing customer-facing Lindt storefront and an integrated admin panel in one React/Vite application. Both sides use the same Redux store and JSON Server database.

## Requirements
- Node.js (LTS recommended)
- npm

## Install dependencies
Open a terminal in this folder and run:

```bash
npm install
```

## Run the project
Open **two terminals** in this same folder.

Terminal 1 — start the JSON Server API:

```bash
npm run server
```

The API runs at http://localhost:3000.

Terminal 2 — start the Vite frontend:

```bash
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Routes
- Customer storefront: http://localhost:5173/
- Admin login: http://localhost:5173/admin/login
- Admin dashboard: http://localhost:5173/admin
- Admin products: http://localhost:5173/admin/products
- Admin users: http://localhost:5173/admin/users
- Admin orders: http://localhost:5173/admin/orders
- Admin settings: http://localhost:5173/admin/settings

## Local demo admin account
- Email: admin@lindt.com
- Password: Admin@123

The demo admin record is in the `admins` collection in `db.json`.

## Notes
- The original customer-side pages, product records, users, carts, wishlists and orders have been retained.
- The admin panel uses the same `db.json` and API on port 3000.
- Admin product operations create, update and delete records in `products`.
- Admin user blocking writes an `isBlocked` flag to the user record. The customer login flow must also check that flag before allowing a blocked account to sign in.
- This is a local learning/demo setup. JSON Server and plain-text demo credentials are not production authentication or security. A production deployment needs server-side authentication, authorization and password hashing.
