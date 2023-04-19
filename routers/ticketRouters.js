const { userAuthorization } = require("../middleware/authorization");
const {
	insertTicket,
	getTickets,
	getTicketById,
} = require("../model/ticketModel/ticketModel");

const router = require("express").Router();

router.all("/", (req, res, next) => {
	next();
});

// create new ticket
router.post("/", userAuthorization, async (req, res) => {
	try {
		const { subject, sender, message } = req.body;

		const userId = req.userId;

		const ticketObj = {
			clientId: userId,
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

// get all ticket for a specific user
router.get("/", userAuthorization, async (req, res) => {
	try {
		const userId = req.userId;

		const result = await getTickets(userId);

		res.json({
			status: "Success",
			message: result,
		});
	} catch (error) {
		res.json({
			status: "Error",
			message: error.message,
		});
	}
});

// get single ticket
router.get("/:ticketId", userAuthorization, async (req, res) => {
	try {
		const { ticketId } = req.params;

		const clientId = req.userId;

		const result = await getTicketById(ticketId, clientId);

		res.json({
			status: "Success",
			message: result,
		});
	} catch (error) {
		res.json({
			status: "Error",
			message: error.message,
		});
	}
});

module.exports = router;
