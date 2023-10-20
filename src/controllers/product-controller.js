const fs = require("fs/promises");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloudinary-service");
const {
	checkProductIdSchema,
	checkProductSchema,
	checkCategorySchema,
	checkCategoryIdSchema,
} = require("../validators/product-validator");

exports.createCategory = async (req, res, next) => {
	try {
		const { value, error } = checkCategorySchema.validate(req.body);

		if (error) {
			return next(createError("not admin", 401));
		}

		const category = await prisma.category.create({
			data: {
				name: value.name,
			},
		});
		res.status(201).json({ message: "category created", category });
	} catch (err) {
		next(err);
	}
};

exports.createProduct = async (req, res, next) => {
	try {
		// if ((!product.name || !product.name.trim()) && !req.file) {
		// 	return next(
		// 		createError("nameProduct or imageProduct is required", 400)
		// 	);

		const { value, error } = checkProductSchema.validate(req.body);

		if (!req.file) {
			return next(createError("product image is requied", 400));
		}

		// const product = { categoryId: req.product.id };
		if (req.file) {
			value.images = await upload(req.file.path);
		}

		const createProduct = await prisma.product.create({
			data: {
				categoryId: value.categoryId,
				name: value.name,
				images: value.images,
				price: value.price,
			},
		});
		res.status(201).json({ message: "product created", createProduct });
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

		// const productId = +req.params.productId;
		const productId = await prisma.product.findUnique({
			where: {
				id: value.productId,
			},
		});
		res.status(200).json({ message: "Get Product By Id", productId });
	} catch (err) {
		console.log(err);
	}
};
