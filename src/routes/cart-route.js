const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const cartController = require("../controllers/cart-controller");

const router = express.Router();

router.post(
	"/mycart/:productId",
	authenticateMiddleware,
	cartController.createProductMyCart
);

router.get("/", authenticateMiddleware, cartController.getProductInCart);

router.delete(
	"/deleteCartAll",
	authenticateMiddleware,
	cartController.deleteCartAll
);

router.delete("/:cartId", authenticateMiddleware, cartController.deleteCart);

module.exports = router;
