# Glimmy Backend API

## Authentication

POST /auth/register

POST /auth/login

GET /auth/refresh

POST /auth/logout

---

## Products

GET /products

GET /products/:id

POST /products

PATCH /products/:id

DELETE /products/:id

PATCH /products/:id/increase-stock

PATCH /products/:id/reduce-stock

PATCH /products/:id/restore

GET /products/low-stock

GET /products/archived

POST /products/:id/images

DELETE /products/:productId/images/:imageId

---

## Orders

GET /orders

GET /orders/:id

POST /orders

PATCH /orders/:id/status

PATCH /orders/:id/cancel

---

## Sales

GET /sales

GET /sales/:id

GET /sales/analytics/top-products

GET /sales/analytics/revenue-trends

GET /sales/analytics/sales-breakdown

GET /sales/analytics/customer-history

---

## Dashboard

GET /dashboard/summary

GET /dashboard/revenue
