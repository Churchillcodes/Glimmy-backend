/*
 DEVELOPMENT ONLY

 WARNING:
 This script deletes all Product, Order and Sale data
 before reseeding the database.
 Do NOT run in production.
*/
console.log("WARNING: This will delete all Product, Order and Sale data.");

if (process.env.NODE_ENV === "production") {
  console.error("Seeder cannot run in production.");
  process.exit(1);
}

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../src/models/Product");
const Order = require("../src/models/Order");
const Sale = require("../src/models/Sale");

// Read JSON seed files
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sample-products.json"), "utf-8"),
);
const ordersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sample-orders.json"), "utf-8"),
);
const salesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sample-sales.json"), "utf-8"),
);

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB Atlas using your .env URI
    console.log("Connecting to database...");
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Database connected successfully.");

    // 2. Clear out existing collection data to prevent duplicates
    console.log("Clearing old data...");
    await Order.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    console.log("Old records deleted cleanly.");

    // 3. Seed Products first
    console.log("Seeding products...");
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded successfully!`);

    // 4. Map Product Names to real MongoDB _id objects for Orders
    console.log("Mapping product relations for orders...");
    const linkedOrders = ordersData.map((order) => {
      const matchedProduct = createdProducts.find(
        (p) => p.name === order.productName,
      );

      if (!matchedProduct) {
        throw new Error(
          `Product match failed for seed order: "${order.productName}"`,
        );
      }

      return {
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerLocation: order.customerLocation,
        product: matchedProduct._id,
        quantity: order.quantity,
        listedPrice: order.listedPrice,
        agreedPrice: order.agreedPrice,
        orderType: order.orderType,
        customRequirements: order.customRequirements || "",
        status: order.status,
        notes: order.notes || "",
      };
    });

    // 5. Seed linked Orders
    console.log("Seeding orders...");
    const createdOrders = await Order.insertMany(linkedOrders);
    console.log(`${createdOrders.length} orders seeded successfully!`);

    // 6. Map relations for Sales records (ADDED THIS SECTION)
    console.log("Mapping relations for sales records...");
    const linkedSales = salesData.map((sale) => {
      const matchedProduct = createdProducts.find(
        (p) => p.name === sale.productName,
      );

      // Look for the corresponding order generated during step 5
      const matchedOrder = createdOrders.find(
        (o) =>
          o.customerName === sale.customerName &&
          o.customerPhone === sale.customerPhone &&
          o.product.toString() === matchedProduct._id.toString(),
      );

      if (!matchedProduct || !matchedOrder) {
        throw new Error(
          `Mapping verification failed for sales item belonging to: ${sale.customerName}`,
        );
      }

      return {
        order: matchedOrder._id,
        product: matchedProduct._id,
        productName: sale.productName,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        customerLocation: sale.customerLocation,
        quantity: sale.quantity,
        listedPrice: sale.listedPrice,
        agreedPrice: sale.agreedPrice,
        totalAmount: sale.totalAmount,
        orderType: sale.orderType,
        saleDate: sale.saleDate,
      };
    });

    // 7. Seed linked Sales (ADDED THIS SECTION)
    console.log("Seeding sales records...");
    const createdSales = await Sale.insertMany(linkedSales);
    console.log(`${createdSales.length} sales entries seeded successfully!`);

    console.log("🎉 Database seeding completed flawlessly! 🎉");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error("Error closing connection:", closeError.message);
    }
    process.exit(1);
  }
};

seedDatabase();
