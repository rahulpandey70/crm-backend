const { userAuthorization } = require("../middleware/authorization");
const {
	insertTicket,
	getTickets,
	getTicketById,
	updateClientReply,
	updateTicketStatus,
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

// update reply message from client
router.put("/:_id", userAuthorization, async (req, res) => {
	try {
		const { message, sender } = req.body;
		const { _id } = req.params;

		const result = await updateClientReply({ _id, message, sender });

		if (result._id) {
			return res.json({
				status: "Success",
				message: "Ticket message updated!",
			});
		}

		res.json({
			status: "Error",
			message: "Unable to update message! Please Try later",
		});
	} catch (error) {
		res.json({
			status: "Error",
			message: error.message,
		});
	}
});

// update ticket status
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
	try {
		const { _id } = req.params;
		const clientId = req.userId;

		const result = await updateTicketStatus({ _id, clientId });

		if (result._id) {
			return res.json({
				status: "Success",
				message: "Ticket has been closed!",
			});
		}

		res.json({
			status: "Error",
			message: "Unable to close your ticket! Please Try later",
		});
	} catch (error) {
		res.json({
			status: "Error",
			message: error.message,
		});
	}
});

module.exports = router;
