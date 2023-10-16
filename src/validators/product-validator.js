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
