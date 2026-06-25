const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Baby Furniture", "Storage Furniture", "Living Room Furniture"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    listedPrice: {
      type: Number,
      required: [true, "Listed price is required"],
      min: 0,
    },

    negotiable: {
      type: Boolean,
      default: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    isMadeToOrder: {
      type: Boolean,
      default: true,
    },

    dimensions: {
      length: {
        type: Number,
        min: 0,
      },

      width: {
        type: Number,
        min: 0,
      },

      height: {
        type: Number,
        min: 0,
      },
    },

    colors: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        url: {
          type: String,
        },

        publicId: {
          type: String,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
