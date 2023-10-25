const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloudinary-service");
const { checkOrderIdSchema } = require("../validators/order-validator");
const {
	STATUS_INCART,
	STATUS_PENDDING,
	STATUS_SUCCESS,
} = require("../config/contants");

exports.createOrder = async (req, res, next) => {
	try {
		const createOrder = await prisma.order.create({
			data: {
				userId: req.user.id,
				status: STATUS_INCART,
			},
		});

		res.status(201).json({ message: "create order", createOrder });
	} catch (err) {
		next(err);
	}
};

exports.cartPadding = async (req, res, next) => {
	try {
		if (!req.file) {
			return next(createError("file is required", 400));
		}

		const existRelationship = await prisma.order.findFirst({
			where: {
				userId: req.user.id,
				status: STATUS_INCART,
			},
		});
		console.log(existRelationship);

		if (req.file) {
			const url = await upload(req.file.path);

			const updateOrder = await prisma.order.update({
				data: {
					slipImage: url,
					status: STATUS_PENDDING,
				},
				where: {
					id: existRelationship.id,
				},
			});
			res.status(201).json({ message: "product created", updateOrder });
		} else {
			return res.status(401).json({ message: "chang padding fail" });
		}
	} catch (err) {
		next(err);
	} finally {
		if (req.file) {
			fs.unlink(req.file.path);
		}
	}
};

exports.cartSuccess = async (req, res, next) => {
	try {
		const { value, error } = checkOrderIdSchema.validate(req.params);
		if (error) {
			return next(error);
		}
		console.log("hello");

		// const orderId = +req.params.orderId;
		const orderPadding = await prisma.order.findFirst({
			where: {
				// id: orderId,
				id: value.orderId,
				status: STATUS_PENDDING,
			},
		});
		console.log(orderPadding);
		if (req.user.role === "ADMIN") {
			const orderSuccess = await prisma.order.update({
				data: {
					status: STATUS_SUCCESS,
				},
				where: {
					id: orderPadding.id,
				},
			});
			res.status(200).json({ message: "update status", orderSuccess });
		} else {
			return res.status(400).json({ message: "not admin" });
		}
	} catch (err) {
		next(err);
	}
};

exports.createOrderItem = async (req, res, next) => {
	try {
		const { value, error } = checkOrderIdSchema.validate(req.params);
		if (error) {
			return next(error);
		}
		console.log("1");
		const cart = await prisma.cart.findMany({
			where: {
				userId: req.user.id,
			},
			include: {
				product: true,
			},
		});
		console.log(cart);

		// const newCart = cart.reduce((acc, item) => {
		// 	acc["price"] = item.product.price * item.amount;
		// 	acc["amount"] = item.amount;

		// 	return acc;
		// }, {});
		// { price: 25000, amount: 25 }

		const newCart = cart.map((item) => {
			return {
				productId: item.productId,
				price: item.product.price * item.amount,
				amount: item.amount,
				orderId: value.orderId,
			};
		});

		console.log(newCart);

		const createOrderItem = await prisma.orderItem.createMany({
			data: newCart,
		});
		// const newArr = newCart.push(value.orderId);
		// const newArr2 = [...newCart, (orderId = value.orderId)];
		// console.log(newArr2);
		// const newArr = [...newCart, ]

		// const orderItem = await prisma.orderItem.createMany({
		// 	data: [{ orderId: value.orderId, newCart }],
		// where: {
		// 	id: relationship.id,
		// },
		// });
		// const arrPriceProduct = cart.map((item) => {
		// 	return item.amount * item.product.price;
		// });
		// console.log(cartToAddToOrder); [ 5000, 5000, 2000 ] item.amount * item.product.price
		// const sumTotalPrice = arrPriceProduct.reduce((acc, item) => {
		// 	acc += item;
		// 	return acc;
		// }, 0);
		// console.log(sumTotalPrice);

		// const arrAmountProduct = cart.map(((item) => {
		//     return item.amount
		// }))
		// console.log(cartToAddToOrder); [5, 5 ,2] item.amount
		// const sumTotalAmount = cart.reduce((acc, item) => {
		// 	acc += item.amount;
		// 	return acc;
		// }, 0);
		// console.log(sumTotalAmount);

		// const relationship = await prisma.order.createMany({
		// data: {
		// 	orderId: 1,
		//     productId: cart.
		// },
		// });
		// console.log(relationship);

		res.status(201).json({ message: "createOrderItem", createOrderItem });
	} catch (err) {
		next(err);
	}
};

exports.getOrderItemAll = async (req, res, next) => {
	try {
		// console.log(req.user, "<==============");

		const orderId = await prisma.order.findMany({
			where: {
				OR: [{ status: STATUS_PENDDING }, { status: STATUS_SUCCESS }],
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						address: true,
					},
				},
				orderItems: {
					select: {
						id: true,
						price: true,
						amount: true,
						product: {
							select: {
								name: true,
								images: true,
								price: true,
							},
						},
					},
				},
			},
		});
		// console.log("=========>", orderId);

		// const getOrderItemAll = await prisma.orderItem.findMany({
		// 	where: {
		// 		orderId: orderId.id,
		// 	},
		// 	orderBy: {
		// 		createdAt: "desc",
		// 	},
		// 	include: {
		// 		order: {
		// 			select: {
		// 				id: true,
		// 				status: true,
		// 				slipImage: true,
		// 				createdAt: true,
		// 				user: {
		// 					select: {
		// 						firstName: true,
		// 						lastName: true,
		// 						address: true,
		// 					},
		// 				},
		// 			},
		// 		},
		// 		product: {
		// 			select: {
		// 				name: true,
		// 				images: true,
		// 				price: true,
		// 			},
		// 		},
		// 	},
		// });
		// console.log(getOrderItemAll);

		res.status(200).json({
			order: orderId,
		});
	} catch (err) {
		next(err);
	}
};

exports.myOrder = async (req, res, next) => {
	try {
		const myOrder = await prisma.order.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				orderItems: {
					select: {
						amount: true,
						price: true,
						product: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		res.status(200).json({ myOrder });
	} catch (err) {
		next(err);
	}
};
