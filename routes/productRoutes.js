const express = require("express");
const productController = require("../Controllers/productController");
const multer = require("../utils/multer");
const router = express.Router();

router.post("/create-product", productController.createProduct);

router.post(
  "/image-upload",
  multer.single("image"),
  productController.uploadImage
);
router.delete("/delete-image/:id", productController.deleteImage);
router.patch("/update-product/:id", productController.updateProduct);
router.get("/get-all-products", productController.getAllProduct);
router.get("/get-product/:id", productController.getProduct);
module.exports = router;
