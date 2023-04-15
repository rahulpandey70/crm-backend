const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
	},
	password: {
		type: String,
		minlength: 8,
		required: true,
	},
	refreshJWTToken: {
		token: {
			type: String,
			maxlength: 400,
			default: "",
		},
		addedAt: {
			type: Date,
			required: true,
			default: Date.now(),
		},
	},
});

module.exports = {
	userSchema: mongoose.model("User", userSchema),
};
