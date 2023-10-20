const Joi = require("joi");

const checkCartSchema = Joi.object({
	productId: Joi.number().integer().positive().required(),
	amount: Joi.number().integer().positive().required(),
});

exports.checkCartSchema = checkCartSchema;

const checkCartIdSchema = Joi.object({
	cartId: Joi.number().integer().positive().required(),
});
exports.checkCartIdSchema = checkCartIdSchema;
