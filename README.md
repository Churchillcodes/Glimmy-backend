# Glimmy Baby Cots & Furniture Backend

Backend API for the Glimmy Baby Cots & Furniture Management System.

This project powers the business operations of Glimmy Baby Cots & Furniture by providing secure APIs for product management, order management, inventory tracking, sales analytics, authentication, and image management.

---

## Project Overview

Glimmy Baby Cots & Furniture is a furniture manufacturing and retail business specializing in baby furniture, storage furniture, and selected home furniture products.

This backend system was developed to replace manual business processes and provide a scalable foundation for:

* Product management
* Order tracking
* Inventory management
* Customer sales tracking
* Business analytics
* Secure administrator access

---

## Features

### Authentication & Authorization

* JWT Authentication
* Access Token & Refresh Token implementation
* Secure password hashing using bcrypt
* Role-Based Authorization
* Protected administrator routes

### Product Management

* Create products
* Retrieve products
* Update products
* Archive products (soft delete)
* Restore archived products
* Low stock monitoring
* Stock increase and reduction

### Cloudinary Image Management

* Upload product images
* Store Cloudinary URLs and Public IDs
* Delete product images
* Prevent deletion of the final product image

### Order Management

* Create customer orders
* Track order status
* Update order status
* Cancel orders
* Inventory restoration on cancellation

### Inventory Management

* Stock tracking
* Low stock detection
* Atomic stock updates
* Inventory-safe order workflows

### Sales Management

* Automatic sales record creation
* Revenue tracking
* Customer purchase history
* Product sales analysis

### Analytics

* Revenue analytics
* Top-selling products
* Sales breakdown reports
* Customer history reports
* Dashboard summaries

### Development Utilities

* Database seed scripts
* Sample data generation
* API documentation

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* JSON Web Tokens (JWT)
* bcrypt

### File Storage

* Cloudinary
* Multer
* Multer Storage Cloudinary

### Development Tools

* Nodemon
* Git
* GitHub
* Postman

---

## Project Structure

```text
src/
│
├── config/
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── utils/
│
├── app.js
│
└── server.js

docs/
│
└── api-endpoints.md

seed/
│
├── sample-products.json
├── sample-orders.json
├── sample-sales.json
└── seeder.js
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Churchillcodes/Glimmy-backend.git
```

Navigate into the project:

```bash
cd glimmy-backend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root and add:

```env
DATABASE_URI=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

---

## Running the Project

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

---

## API Documentation

Detailed API endpoint documentation can be found in:

```text
docs/api-endpoints.md
```

The documentation includes:

* Authentication endpoints
* Product endpoints
* Order endpoints
* Sales endpoints
* Dashboard endpoints
* Analytics endpoints

---

## Database Seeding

Development only.

Run:

```bash
npm run seed
```

### Warning

The seeding script will delete all:

* Products
* Orders
* Sales

before recreating them from the sample data files.

The script is protected from running in production environments.

---

## Security Features

* Password hashing using bcrypt
* JWT Access Tokens
* JWT Refresh Tokens
* Protected routes
* Role-based access control
* Secure cookie handling
* Input validation
* MongoDB schema validation

---

## Current Roles

### Admin

Administrators have access to:

* Products
* Orders
* Sales
* Analytics
* Dashboard

### Future Roles (Planned)

* Staff Accounts
* Inventory Personnel
* Sales Personnel

---

## Future Enhancements

Planned Version 2 Features:

* Customer Accounts
* MPesa Integration
* Online Checkout
* Shopping Cart
* Employee Accounts
* Manufacturing Tracking
* Raw Material Tracking
* Role-Based Permissions Expansion
* Customer Reviews

---

## Author

**Churchill**

Full Stack Web Development Student

GitHub:
https://github.com/Churchillcodes

---

## License

This project is currently proprietary and was developed for Glimmy Baby Cots & Furniture.
