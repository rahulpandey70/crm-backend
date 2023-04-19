const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
	clientId: {
		type: mongoose.Schema.Types.ObjectId,
	},
	subject: {
		type: String,
		required: true,
	},
	openAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	status: {
		type: String,
		required: true,
		default: "Pending",
	},
	conversations: [
		{
			sender: {
				type: String,
				required: true,
				default: "",
			},
			message: {
				type: String,
				required: true,
				default: "",
			},
			msgAt: {
				type: Date,
				required: true,
				default: Date.now(),
			},
		},
	],
});

module.exports = {
	ticketSchema: mongoose.model("Ticket", ticketSchema),
};
