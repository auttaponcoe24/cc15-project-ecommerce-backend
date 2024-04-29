const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");
const productController = require("../controllers/product-controller");

const router = express.Router();

router.post(
	"/category",
	authenticateMiddleware,
	productController.createCategory
);

router.post(
	"/categoryId",
	authenticateMiddleware,
	uploadMiddleware.single("images"),
	productController.createProduct
);

router.delete(
	"/:productId/delete",
	authenticateMiddleware,
	productController.deleteProduct
);

router.get("/all", productController.getAllProduct);

router.get("/getcategory", productController.getAllCategory);

router.get("/get-productId", productController.getProductId);

// router.patch(
// 	"/editproduct/:productId",
// 	uploadMiddleware.single("images"),
// 	productController.editProduct
// );
router.patch(
	"/edit-product",
	uploadMiddleware.single("images"),
	productController.editProduct
);

module.exports = router;
