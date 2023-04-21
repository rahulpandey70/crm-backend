const { userAuthorization } = require("../middleware/authorization");
const {
	newTicketValidation,
	TicketMessageValidation,
} = require("../middleware/formValidationMiddleware");
const {
	insertTicket,
	getTickets,
	getTicketById,
	updateClientReply,
	updateTicketStatus,
	deleteTicket,
} = require("../model/ticketModel/ticketModel");

const router = require("express").Router();

router.all("/", (req, res, next) => {
	next();
});

// create new ticket
router.post("/", newTicketValidation, userAuthorization, async (req, res) => {
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
			return res.json({ status: "success", messgae: "New Ticket created!" });
		}

		res.json({
			status: "error",
			message: "Somthing is wrong, Try Again later!",
		});
	} catch (error) {
		res.json({
			status: "error",
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
			status: "success",
			data: result,
		});
	} catch (error) {
		res.json({
			status: "error",
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
			status: "success",
			data: result,
		});
	} catch (error) {
		res.json({
			status: "error",
			message: error.message,
		});
	}
});

// update reply message from client
router.put(
	"/:_id",
	userAuthorization,
	TicketMessageValidation,
	async (req, res) => {
		try {
			const { message, sender } = req.body;
			const { _id } = req.params;
			const clientId = req.userId;

			const result = await updateClientReply({
				_id,
				clientId,
				message,
				sender,
			});

			if (result._id) {
				return res.json({
					status: "success",
					message: "Ticket message updated!",
				});
			}

			res.json({
				status: "error",
				message: "Unable to update message! Please Try later",
			});
		} catch (error) {
			res.json({
				status: "error",
				message: error.message,
			});
		}
	}
);

// update ticket status
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
	try {
		const { _id } = req.params;
		const clientId = req.userId;

		const result = await updateTicketStatus({ _id, clientId });

		if (result._id) {
			return res.json({
				status: "success",
				message: "Ticket has been closed!",
			});
		}

		res.json({
			status: "error",
			message: "Unable to close your ticket! Please Try later",
		});
	} catch (error) {
		res.json({
			status: "error",
			message: error.message,
		});
	}
});

// delete ticket
router.delete("/:_id", userAuthorization, async (req, res) => {
	try {
		const { _id } = req.params;
		const clientId = req.userId;

		await deleteTicket({ _id, clientId });

		return res.json({
			status: "success",
			message: "Ticket has been deleted!",
		});
	} catch (error) {
		res.json({
			status: "error",
			message: error.message,
		});
	}
});

module.exports = router;
