# Organic — Fruits & Vegetables Grocery Store (React + Vite)

Built from the supplied `.fig` file (Home frame, 1800px wide, 1600px content column).

## Run
```
npm install
npm run dev          # storefront at http://localhost:5173
npm run server:dev    # API at http://localhost:3001
npm run build         # production build into dist/
```

## MongoDB backend

The Express API uses MongoDB for products, customers, order records, stock, sales, and product-view counts.

1. Start a local MongoDB server or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET` (at least 32 characters), `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` (at least 12 characters). Keep `.env` private; it is ignored by Git.
3. In one terminal run `npm run seed` to insert the original storefront products. The seed only inserts missing products, so it does not overwrite later admin edits.
4. Run `npm run server:dev` and `npm run dev` in separate terminals.
5. Open `http://localhost:5173/?admin=1` and sign in with the admin credentials from `.env`.

The dashboard supports product creation, editing, and removal (removal hides products without deleting order history), including uploading JPEG, PNG, WebP, or GIF product images up to 5 MB. Uploaded images are served from `/uploads` and stored in the ignored local `uploads/` directory. It also shows current inventory, unique product views, units sold, registered/checkout customers, and sales totals, and lets admins update order tracking statuses. New checkouts reserve stock and receive an `OG-...` tracking number. Customers can look up an order with `GET /api/orders/track/:trackingNumber`.

Customer registration and login use hashed passwords and expiring bearer tokens. Admin API routes require an admin token. Store card options are still demonstration-only; this project does not process payments. Configure a real payment provider before accepting card payments.

## Notes
- Layout, colors, type sizes, radii and shadows were read from the Figma file data. Colors are CSS variables in `src/styles/global.css`.
- Images are the original Figma assets converted to WebP (`public/images`); sprite-sheet product photos are cropped per the design. Logo, badges, app art and most icons are SVG exported from Figma vectors (`public/icons`).
- Fonts: Inter, Open Sans, Roboto via Google Fonts (`index.html`). Varela Round substitutes Arial Rounded MT Bold (newsletter heading). Ionicons chevrons/social icons come from react-icons' Ionicons set.
- Product catalog, checkout orders, customer accounts, and product-view metrics use the backend when it is configured. Wishlist and cart remain browser-local.
- The hamburger drawer and the mobile/tablet layouts are my own adaptations, not from the Figma file.
- Verified with `npm run build`. The MongoDB-backed API and checkout require a configured MongoDB URI in `.env`.
