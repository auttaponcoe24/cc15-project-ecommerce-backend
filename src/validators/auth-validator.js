const Joi = require("joi");

const registerSchema = Joi.object({
	firstName: Joi.string().trim().required(),
	lastName: Joi.string().trim().required(),
	emailOrUsername: Joi.alternatives([
		Joi.string().pattern(
			/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,15}$/
		),
		Joi.string().pattern(/^[a-zA-Z0-9]{3,15}$/),
	])
		.required()
		.strip(),
	password: Joi.string()
		.pattern(/^[a-zA-Z0-9]{6,30}$/)
		.trim()
		.required(),
	confirmPassword: Joi.string()
		.valid(Joi.ref("password"))
		.trim()
		.required()
		.strip(),
	username: Joi.forbidden().when("emailOrUsername", {
		is: Joi.string().pattern(/^[a-zA-Z0-9]{3,15}$/),
		then: Joi.string().default(Joi.ref("emailOrUsername")),
	}),
	email: Joi.forbidden().when("emailOrUsername", {
		not: Joi.string().pattern(/^[a-zA-Z0-9]{3,15}$/),
		then: Joi.string().default(Joi.ref("emailOrUsername")),
	}),
	address: Joi.string().trim().required(),
	role: Joi.string().trim(),
});

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
	emailOrUsername: Joi.string().required(),
	password: Joi.string().required(),
});

exports.loginSchema = loginSchema;
