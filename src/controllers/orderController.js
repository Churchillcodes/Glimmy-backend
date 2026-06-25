const Order = require("../models/Order");
const Product = require("../models/Product");

//creating an order
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerLocation,
      product,
      quantity,
      agreedPrice,
      notes,
      customRequirements,
    } = req.body;

    const existingProduct = await Product.findById(product);

    if (!product) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!existingProduct || !existingProduct.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const listedPrice = existingProduct.listedPrice;

    const orderType = existingProduct.isMadeToOrder
      ? "Custom Order"
      : "Inventory Sale";

    if (orderType === "Inventory Sale") {
      if (
        !existingProduct.isMadeToOrder &&
        existingProduct.quantity < quantity
      ) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }
    }
    const order = await Order.create({
      customerName,
      customerPhone,
      product,
      quantity,
      listedPrice,
      agreedPrice,
      orderType,
      customRequirements,
      customerLocation,
      notes,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
};

//getting all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product", "name listedPrice")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//get an order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "product",
      "name listedPrice category",
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
};

//updating our order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "In Production",
      "Ready",
      "Delivered",
      "Cancelled",
    ];
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    status = status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const product = await Product.findById(order.product);

    if (!product) {
      return res.status(404).json({
        message: "Associated product not found",
      });
    }

    /*
      PENDING -> CONFIRMED
      Reserve inventory
    */
    if (
      order.status === "Pending" &&
      status === "Confirmed" &&
      !product.isMadeToOrder
    ) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: product._id,
          quantity: { $gte: order.quantity },
        },
        {
          $inc: { quantity: -order.quantity },
        },
        {
          new: true,
        },
      );

      if (!updatedProduct) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }
    }

    /*
      CONFIRMED -> CANCELLED
      Return inventory
    */
    if (
      order.status === "Confirmed" &&
      status === "Cancelled" &&
      !product.isMadeToOrder
    ) {
      await Product.findByIdAndUpdate(product._id, {
        $inc: {
          quantity: order.quantity,
        },
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
};

//cancelling an order
const cancelOrder = async (req, res) => {
  try {
    req.body.status = "Cancelled";

    return updateOrderStatus(req, res);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
