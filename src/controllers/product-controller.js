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

		// if (error) {
		// 	return next(createError("not admin", 401));
		// }

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
				detail: value.detail,
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
	const { page, page_size, keyword } = req.query;

	try {
		if (keyword !== "") {
			const start_limit = (Number(page) - 1) * Number(page_size) + 1;
			const productAll = await prisma.product.findMany({
				skip: (Number(page) - 1) * Number(page_size),
				take: Number(page_size),
				select: {
					id: true,
					name: true,
					detail: true,
					price: true,
					images: true,
					categoryId: true,
					category: {
						select: {
							name: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
				where: {
					name: {
						contains: keyword,
					},
				},
			});
			const totalProduct = await prisma.product.findMany({
				where: {
					name: {
						contains: keyword,
					},
				},
			});
			res.status(200).json({
				message: "get All product",
				productAll,
				totalProduct: totalProduct.length,
				start_limit: start_limit,
			});
		} else {
			const start_limit = (Number(page) - 1) * Number(page_size) + 1;
			const productAll = await prisma.product.findMany({
				skip: (Number(page) - 1) * Number(page_size),
				take: Number(page_size),
				select: {
					id: true,
					name: true,
					detail: true,
					price: true,
					images: true,
					categoryId: true,
					category: {
						select: {
							name: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			const totalProduct = await prisma.product.findMany({});
			res.status(200).json({
				message: "get All product",
				productAll,
				totalProduct: totalProduct.length,
				start_limit,
			});
		}
	} catch (err) {
		next(err);
	}
};

exports.getAllCategory = async (req, res, next) => {
	const { keyword, page_current, page_size } = req.query;

	try {
		const start_limit = (Number(page_current) - 1) * Number(page_size) + 1;
		if (keyword === "" || undefined || null) {
			const category = await prisma.category.findMany({
				take: Number(page_size),
				skip: (Number(page_current) - 1) * Number(page_size),
				orderBy: {
					id: "desc",
				},
			});
			// return categoryAll;
			const categoryAll = await prisma.category.findMany();
			res.status(200).json({
				message: "Fetch Category",
				fetchCategory: category,
				totalRecord: categoryAll.length,
				start_limit,
			});
		} else {
			const category = await prisma.category.findMany({
				take: Number(page_size),
				skip: (Number(page_current) - 1) * Number(page_size),
				orderBy: {
					id: "desc",
				},
				where: {
					name: {
						contains: keyword,
					},
				},
			});
			const categoryAll = await prisma.category.findMany({
				where: {
					name: {
						contains: keyword,
					},
				},
			});
			res.status(200).json({
				message: "Fetch Category",
				fetchCategory: category,
				totalRecord: categoryAll.length,
				start_limit,
			});
		}
	} catch (err) {
		next(err);
	}
};

exports.getProductId = async (req, res, next) => {
	try {
		// const { value, error } = checkProductIdSchema.validate(req.query);
		const { productId } = req.query;

		// if (error) {
		// 	return next(error);
		// }

		// const productId = +req.params.productId;
		const productById = await prisma.product.findFirst({
			where: {
				id: Number(productId),
			},
		});
		res.status(200).json({ message: "Get Product By Id", productById });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		const { value, error } = checkProductIdSchema.validate(req.params);
		if (error) {
			return next(createError("not productid", 400));
		}

		const deleteProduct = await prisma.product.delete({
			where: {
				id: value.productId,
			},
		});

		res.status(200).json({ deleteProduct });
	} catch (err) {
		next(err);
	}
};

exports.editProduct = async (req, res, next) => {
	try {
		const { value, error } = checkProductSchema.validate(req.body);
		const { productId } = req.query;

		// const { productId } = req.params;
		// const productId = req.params.productId

		// console.log("==>", value);
		// if (!req.file) {
		// 	return next(createError("product image is requied", 400));
		// }
		const findProductId = await prisma.product.findFirst({
			where: {
				id: Number(productId),
			},
		});

		// const product = { categoryId: req.product.id };
		if (req.file) {
			value.images = await upload(req.file.path);
		}

		// console.log("fff");
		const editProduct = await prisma.product.update({
			data: {
				categoryId: value.categoryId,
				name: value.name,
				images: value.images,
				price: value.price,
				detail: value.detail,
			},
			where: {
				id: Number(productId),
				// id: findProductId.id,
			},
		});

		// console.log("-->>", editProduct);

		res.status(201).json({ editProduct });
	} catch (err) {
		next(err);
	} finally {
		if (req.file) {
			fs.unlink(req.file.path);
		}
	}
};
