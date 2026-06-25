const Product = require("../models/Product");

//create product
const createProduct = async (req, res) => {
  try {
    const duplicate = await Product.findOne({ name: req.body.name });
    if (duplicate) {
      return res.status(409).json({ message: "Product already exists" });
    }
    const newProduct = await Product.create(req.body);
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//retrieve all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//retrieving a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      _id: id,
      isActive: true,
    });
    if (!product) {
      return res.status(404).json({ message: `No product matches ID ${id}.` });
    }
    res.status(200).json(product);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: err.message });
  }
};

//update a product by ID
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.name) {
      const duplicate = await Product.findOne({
        name: new RegExp(`^${req.body.name}$`, "i"),
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Product name already exists",
        });
      }
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: err.message });
  }
};

//get low-stock products
const getLowStockProducts = async (req, res) => {
  try {
    const parsedThreshold = parseInt(req.query.threshold);
    if (req.query.threshold !== undefined) {
      if (isNaN(parsedThreshold) || parsedThreshold < 0) {
        return res.status(400).json({
          message: "Threshold must be a valid positive number",
        });
      }
    }
    const threshold = isNaN(parsedThreshold) ? 5 : parsedThreshold;
    const products = await Product.find({
      quantity: { $lte: threshold },
      isActive: true,
      isMadeToOrder: false,
    });
    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: `Stock quantity is healthy above ${threshold}` });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//restock products
const increaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const addedAmount = Number(req.body.quantity);

    //validate product quantity isn't 0 or less
    if (isNaN(addedAmount) || addedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Restock amount must be greater than 0" });
    }
    //find and increment(make it atomic)
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        $inc: { quantity: addedAmount },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } /* 
    //restock history snapshots
    await Restock.create({
      productId: product._id,
      productName: product.name,
      stockBeforeRestock: product.quantity - addedAmount,
      stockAfterRestock: product.quantity,
      quantityAdded: addedAmount,
    }); */

    res
      .status(200)
      .json({ message: "Product restocked successfully", product });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: err.message });
  }
};

//reduce stock
const reduceStock = async (req, res) => {
  try {
    const { id } = req.params;
    const requestedAmount = Number(req.body.quantity);

    //validate product quantity isn't 0 or less
    if (isNaN(requestedAmount) || requestedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Stock amount must be greater than 0" });
    }
    //find and decrease(make it atomic)
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        quantity: { $gte: requestedAmount },
        isActive: true,
      },
      {
        $inc: { quantity: -requestedAmount },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or Insufficient stock" });
    }

    res.status(200).json({ message: "Stock reduced successfully", product });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: err.message });
  }
};

//delete(archive) a product
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        returnDocument: "after",
      },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product archived successfully",
      product,
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

//retrieve all archived products
const getArchivedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: false }).sort({
      updatedAt: -1,
    });
    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No archived products currently" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//restore an archived product
const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: true },
      { returnDocument: "after" },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product restored successfully",
      product,
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

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  getLowStockProducts,
  deleteProductById,
  getArchivedProducts,
  restoreProduct,
  increaseStock,
  reduceStock,
};
