const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");
const productController = require("../controllers/product-controller");

const router = express.Router();

router.post(
	"/",
	authenticateMiddleware,
	uploadMiddleware.single("images"),
	productController.createProduct
);

router.get("/all", productController.getAllProduct);

router.get("/:productId", productController.getProductId);

module.exports = router;
