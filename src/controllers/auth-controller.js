const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
	try {
		const { value, error } = registerSchema.validate(req.body);
		if (error) {
			error.statusCode = 400;
			return next(error);
		}
		value.password = await bcrypt.hash(value.password, 12);

		const user = await prisma.user.create({
			data: value,
		});
		const payload = { userId: user.id };
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_SECRET_KEY || "randowKey",
			{ expiresIn: process.env.JWT_EXPIRE }
		);
		// delete user.role;
		delete user.password;
		res.status(201).json({ accessToken: accessToken, user });
	} catch (err) {
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { value, error } = loginSchema.validate(req.body);
		if (error) {
			error.statusCode = 400;
			return next(error);
		}

		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: value.emailOrUsername },
					{ username: value.emailOrUsername },
				],
			},
		});

		if (!user) {
			return next(createError("invalid credential", 400));
		}

		const isMatch = await bcrypt.compare(value.password, user.password);
		if (!isMatch) {
			return next(createError("invalid credential", 400));
		}

		const payload = { userId: user.id };
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_SECRET_KEY || "randomKey",
			{ expiresIn: process.env.JWT_EXPIRE }
		);

		delete user.password;
		res.status(200).json({ accessToken, user });
	} catch (err) {
		return next(err);
	}
};

exports.getMe = (req, res) => {
	res.status(200).json({ user: req.user });
};

exports.editAccount = async (req, res, next) => {
	try {
		const findUser = await prisma.user.findFirst({
			where: {
				id: req.user.id,
			},
		});
		console.log("=====>", findUser);

		const editAccount = await prisma.user.update({
			data: {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				address: req.body.address,
			},
			where: {
				id: findUser.id,
			},
		});
		res.status(200).json({ editAccount });
	} catch (err) {
		next(err);
	}
};
