const { rateLimit } = require("express-rate-limit");

module.exports = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 300,
	message: { message: "Too many request from this IP" },
});
