const express = require("express");
const app = express();
const logger = require("./middleware/logger");
const cookieParser = require("cookie-parser");

// 1. Global Middleware
app.use(logger);
app.use(express.json());
app.use(cookieParser());

// 2. Routes
app.use("/", require("./routes/root"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
// 3. Exporting the app instance
module.exports = app;
