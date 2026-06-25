const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);

router.post("/", createOrder);

router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;
