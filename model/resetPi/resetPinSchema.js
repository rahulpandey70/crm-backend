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
});

module.exports = {
	resetPinSchema: mongoose.model("ResetPin", resetPinSchema),
};
