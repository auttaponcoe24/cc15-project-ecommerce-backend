const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
	checkProductIdSchema,
	checkCartIdSchema,
} = require("../validators/product-validator");

exports.createProductMyCart = async (req, res, next) => {
	try {
		const { value, error } = checkProductIdSchema.validate(req.params);

		if (error) {
			return next(error);
		}

		// const admin = { [req.user.role]: "ADMIN" };
		if (req.user.role === "ADMIN") {
			return next(createError("admin not buy product", 401));
		}

		// const { amount } = req.body;
		const addCart = await prisma.cart.create({
			data: {
				userId: req.user.id,
				productId: value.productId,
				amount: req.body.amount,
			},
			include: {
				product: true,
			},
		});

		res.status(201).json({ message: "add product in cart", addCart });
	} catch (err) {
		next(err);
	}
};

exports.getProductInCart = async (req, res, next) => {
	try {
		const { value, error } = checkProductIdSchema.validate(req.params);
		const cart = await prisma.cart.findMany({
			where: {
				userId: req.user.id,
				id: value.productId,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				product: true,
			},
		});

		// console.log(cart);

		const arrSumProduct = cart.map((item) => {
			return item.amount * item.product.price;
		});
		const sumTotalProduct = arrSumProduct.reduce((acc, item) => {
			acc += item;
			return acc;
		}, 0);
		// console.log(sumTotalProduct);

		res.status(200).json({ message: "cart", cart, sumTotalProduct });
	} catch (err) {
		next(err);
	}
};

exports.changeAmount = async (req, res, next) => {
	try {
		const { value, error } = checkCartIdSchema.validate(req.params);
		if (error) {
			return next(createError("not found cartId", 400));
		}

		const cart = await prisma.cart.findFirst({
			where: {
				userId: req.user.id,
				id: value.cartId,
			},
		});

		// console.log("=====>", cart);

		const amount = await prisma.cart.update({
			data: {
				amount: +req.body.amount,
			},
			where: {
				id: cart.id,
			},
		});
		res.status(200).json({ amount });
	} catch (err) {
		next(err);
	}
};

exports.deleteCart = async (req, res, next) => {
	try {
		// console.log("a");

		const { value, error } = checkCartIdSchema.validate(req.params);
		if (error) {
			return next(error);
		}
		// console.log("b");
		// console.log(value);
		// console.log(req);

		const existCart = await prisma.cart.findFirst({
			where: {
				id: value.cartId,
				// userId: req.user.id,
			},
		});
		console.log(existCart);

		if (!existCart) {
			return next(createError("cann't delete this cart", 400));
		}

		const deleteCart = await prisma.cart.delete({
			where: {
				id: existCart.id,
			},
		});

		res.status(200).json({ message: "deleted", deleteCart });
	} catch (err) {
		next(err);
	}
};

exports.deleteCartAll = async (req, res, next) => {
	try {
		const deleteCartAll = await prisma.cart.deleteMany({
			where: {
				userId: req.user.id,
			},
		});

		res.status(200).json({
			message: "deleted cartAll",
			deleteCartAll,
		});
	} catch (err) {
		next(err);
	}
};

// exports.createOrder = async (req, res, next) => {
// 	try {
// 		const cart = await prisma.cart.findMany({
// 			where: {
// 				userId: req.user.id,
// 			},
// 			include: {
// 				product: true,
// 			},
// 		});
// 		console.log(cart);

// 		const createOrder = await prisma.order.create({
// 			data: {
// 				userId: req.user.id,
// 				status: STATUS_INCART,
// 			},
// 		});

// 		const cartToAddToOrder = cart.map((item) => {
// 			return item.amount * item.product.price;
// 		});
// 		const sumTotalProduct = cartToAddToOrder.reduce((acc, item) => {
// 			acc += item;
// 			return acc;
// 		}, 0);
// 		console.log(sumTotalProduct);
// 		// console.log(cartToAddToOrder); [5, 5 ,2] item.amount
// 		// console.log(cartToAddToOrder); [ 5000, 5000, 2000 ] item.amount * item.product.price

// 		res.status(201).json({ message: "create order", createOrder });
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.cartPadding = async (req, res, next) => {
// 	try {
// 		if (!req.file) {
// 			return next(createError("file is required", 400));
// 		}

// 		const existRelationship = await prisma.order.findFirst({
// 			where: {
// 				userId: req.user.id,
// 				status: STATUS_INCART,
// 			},
// 		});
// 		console.log(existRelationship);

// 		if (req.file) {
// 			const url = await upload(req.file.path);

// 			const updateOrder = await prisma.order.update({
// 				data: {
// 					slipImage: url,
// 					status: STATUS_PENDDING,
// 				},
// 				where: {
// 					id: existRelationship.id,
// 				},
// 			});
// 			res.status(201).json({ message: "product created", updateOrder });
// 		}
// 		return res.status(401).json({ message: "chang padding fail" });
// 	} catch (err) {
// 		next(err);
// 	} finally {
// 		if (req.file) {
// 			fs.unlink(req.file.path);
// 		}
// 	}
// };

// exports.cartSuccess = async (req, res, next) => {
// 	const { value, error } = checkOrderIdIdSchema.validate(req.params);
// 	if (error) {
// 		next(error);
// 	}
// 	try {
// 		const orderPadding = await prisma.order.findFirst({
// 			where: {
// 				id: value.orderId,
// 				status: STATUS_PENDDING,
// 			},
// 		});
// 		console.log(orderPadding);
// 		if (req.user.role === "ADMIN") {
// 			const orderSuccess = await prisma.order.update({
// 				data: {
// 					status: STATUS_SUCCESS,
// 				},
// 				where: {
// 					id: orderPadding.id,
// 				},
// 			});
// 			res.status(200).json({ message: "update status", orderSuccess });
// 		} else {
// 			return res.status(400).json({ message: "not admin" });
// 		}
// 	} catch (err) {
// 		next(err);
// 	}
// };
