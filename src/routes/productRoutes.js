const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  getLowStockProducts,
  deleteProductById,
  updateProductById,
  getArchivedProducts,
  restoreProduct,
  increaseStock,
  reduceStock,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/archived", getArchivedProducts);
router.get("/low-stock", getLowStockProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.patch("/:id", updateProductById);
router.patch("/:id/restore", restoreProduct);
router.patch("/:id/increase-stock", increaseStock);
router.patch("/:id/reduce-stock", reduceStock);

router.delete("/:id", deleteProductById);

module.exports = router;
