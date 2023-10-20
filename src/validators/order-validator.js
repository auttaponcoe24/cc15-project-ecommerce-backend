const Joi = require("joi");

const checkOrderIdSchema = Joi.object({
	orderId: Joi.number().integer().positive().required(),
});
exports.checkOrderIdSchema = checkOrderIdSchema;

const checkOrderItemSchema = Joi.object({
	price: Joi.number().integer().positive().required(),
	amount: Joi.number().integer().positive().required(),
});
exports.checkOrderItemSchema = checkOrderItemSchema;
