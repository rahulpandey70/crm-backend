const mongoose = require("mongoose");

const resetPinSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	pin: {
		type: String,
		minlength: 6,
		maxlength: 6,
	},
	addedAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

module.exports = {
	resetPinSchema: mongoose.model("ResetPin", resetPinSchema),
};
