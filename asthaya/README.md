# Asthaya We Heal — Full E-Commerce Website

## Quick Start
```bash
npm install
node server.js
```
Then open http://localhost:7842

## Features
- 35 real products across 4 categories
- User registration & login (JWT auth)
- Shopping cart (add, update, remove)
- Full checkout with address + payment method
- Order history
- Product search & category filtering
- Fully responsive design

## Tech Stack
- Backend: Node.js + Express + JSON file DB
- Frontend: Vanilla JS SPA (no framework)
- Auth: JWT tokens

## API Endpoints
- GET  /api/products          — list/filter/search products
- GET  /api/products/:id      — product detail
- GET  /api/products/categories
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/cart              (auth required)
- POST /api/cart              (auth required)
- PUT  /api/cart/:id          (auth required)
- DELETE /api/cart/:id        (auth required)
- POST /api/orders            (auth required)
- GET  /api/orders            (auth required)
