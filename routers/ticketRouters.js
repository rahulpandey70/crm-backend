const { insertTicket } = require("../model/ticketModel/ticketModel");

const router = require("express").Router();

router.all("/", (req, res, next) => {
	next();
});

router.post("/", async (req, res) => {
	try {
		const { subject, sender, message } = req.body;

		const ticketObj = {
			clientId: "643cfe028fa24b49263421fd",
			subject,
			conversations: [
				{
					sender,
					message,
				},
			],
		};

		const result = await insertTicket(ticketObj);

		if (result._id) {
			return res.json({ status: "Success", messgae: "New Ticket created!" });
		}

		res.json({
			status: "Error",
			message: "Somthing is wrong, Try Again later!",
		});
	} catch (error) {
		res.json({
			status: "Error",
			message: error.message,
		});
	}
});

module.exports = router;
