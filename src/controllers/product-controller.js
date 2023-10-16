const fs = require("fs/promises");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloudinary-service");
const { checkProductIdSchema } = require("../validators/product-validator");

exports.createProduct = async (req, res, next) => {
	try {
		// const { name, price, images } = req.body;
		const product = req.body;
		if ((!product.name || !product.name.trim()) && !req.file) {
			return next(
				createError("nameProduct or imageProduct is required", 400)
			);
		}

		// const product = req.body;
		// {
		//     name : '',
		//     price: '',
		//     image: ''
		// }
		const admin = req.user.role; //authenMiddle
		if (admin === "ADMIN") {
			if (req.file) {
				product.images = await upload(req.file.path);
			}
			product.categoryId = Number(product.categoryId);
			const createProduct = await prisma.product.create({
				data: product,
			});
			return res
				.status(201)
				.json({ message: "product created", createProduct });
		} else {
			return res.status(400).json({ message: "not admin" });
		}
	} catch (err) {
		next(err);
	} finally {
		if (req.file) {
			fs.unlink(req.file.path);
		}
	}
};

exports.getAllProduct = async (req, res, next) => {
	try {
		const productAll = await prisma.product.findMany({
			select: {
				id: true,
				name: true,
				price: true,
				images: true,
				categoryId: true,
			},
		});

		res.status(200).json({ message: "get All product", productAll });
	} catch (err) {
		next(err);
	}
};

exports.getProductId = async (req, res, next) => {
	try {
		const { value, error } = checkProductIdSchema.validate(req.params);

		if (error) {
			return next(error);
		}

		const productId = +req.params.productId;
		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		});
		res.status(200).json({ message: "Get Product By Id", product });
	} catch (err) {
		console.log(err);
	}
};
