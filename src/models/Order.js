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
      match: [
        /^(?:\+254|254|0)(7\d{8}|1\d{8})$/,
        "Please provide a valid Kenyan phone number",
      ],
    },

    customerLocation: {
      type: String,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
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
      min: 1,
    },

    agreedPrice: {
      type: Number,
      required: true,
      min: 1,
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
