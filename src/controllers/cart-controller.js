const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
	checkProductIdSchema,
	checkCartIdSchema,
} = require("../validators/product-validator");

exports.createProductMyCart = async (req, res, next) => {
	try {
		const { value, error } = checkProductIdSchema.validate(req.params);
		const cart = req.body;
		if (error) {
			return next(error);
		}

		// const admin = { [req.user.role]: "ADMIN" };
		if (req.user.role === "ADMIN") {
			return next(createError("admin not buy product", 401));
		}

		// const targetProduct = prisma.product.findUnique({
		// 	where: {
		// 		id: value.productId,
		// 	},
		// });

		const addCart = await prisma.cart.create({
			data: {
				userId: req.user.id,
				productId: value.productId,
				quantiry: cart.quantiry,
			},
			include: { product: true },
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
			include: {
				product: true,
			},
		});
		// const cart = await prisma.cart.findMany({
		// 	where: {
		// 		// id: value.cartId,
		// 		userId: req.user.id,
		// 	},
		// 	select: {
		// 		id: true,
		// 		product: true,
		// 		quantiry: true,
		// 	},
		// });

		res.status(200).json({ message: "cart", cart });
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
		// const cart = await prisma.cart.findMany({
		// 	where: {
		// 		userId: req.user.id,
		// 	},
		// });
		// console.log(cart, "=========");

		// const { value, error } = checkCartIdSchema.validate({
		// 	cartId: value.id,
		// });

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
