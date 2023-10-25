const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");

const orderController = require("../controllers/order-controller");

const router = express.Router();

router.post(
	"/confirmorder/incart",
	authenticateMiddleware,
	orderController.createOrder
);

router.patch(
	"/confirmorder/padding",
	authenticateMiddleware,
	uploadMiddleware.single("slipImage"),
	orderController.cartPadding
);

router.post(
	"/confirmorder/check/:orderId",
	authenticateMiddleware,
	orderController.createOrderItem
);

router.get("/myorder", authenticateMiddleware, orderController.myOrder);

// admin

router.get("/orderitem", orderController.getOrderItemAll);

router.patch(
	"/confirmorder/success/:orderId",
	authenticateMiddleware,
	orderController.cartSuccess
);

module.exports = router;
