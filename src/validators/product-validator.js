const Joi = require("joi");

const checkUserIdSchema = Joi.object({
	userId: Joi.number().integer().positive().required(),
});
exports.checkUserIdSchema = checkUserIdSchema;

const checkProductIdSchema = Joi.object({
	productId: Joi.number().integer().positive().required(),
});
exports.checkProductIdSchema = checkProductIdSchema;

const checkCartIdSchema = Joi.object({
	cartId: Joi.number().integer().positive().required(),
});
exports.checkCartIdSchema = checkCartIdSchema;

const checkOrderIdIdSchema = Joi.object({
	orderId: Joi.number().integer().positive().required(),
});
exports.checkOrderIdIdSchema = checkOrderIdIdSchema;

const checkProductSchema = Joi.object({
	categoryId: Joi.number().required(),
	name: Joi.string().trim().required(),
	detail: Joi.string().trim(),
	images: Joi.string(),
	price: Joi.number().required(),
});
exports.checkProductSchema = checkProductSchema;

const checkCategorySchema = Joi.object({
	name: Joi.string().trim().required(),
});
exports.checkCategorySchema = checkCategorySchema;

const checkCategoryIdSchema = Joi.object({
	categoryId: Joi.number().integer().positive().required(),
});

exports.checkCategoryIdSchema = checkCategoryIdSchema;
