const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    customerLocation: {
      type: String,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    listedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    agreedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    orderType: {
      type: String,
      enum: ["Inventory Sale", "Custom Order"],
      required: true,
    },

    customRequirements: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "In Production",
        "Ready",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
