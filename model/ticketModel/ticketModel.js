const { ticketSchema } = require("./ticketSchema");

const insertTicket = (ticketObj) => {
	return new Promise((resolve, reject) => {
		try {
			ticketSchema(ticketObj)
				.save()
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		} catch (error) {
			reject(error);
		}
	});
};

const getTickets = (clientId) => {
	return new Promise((resolve, reject) => {
		try {
			ticketSchema
				.find({ clientId })
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		} catch (error) {
			reject(error);
		}
	});
};

const getTicketById = (_id, clientId) => {
	return new Promise((resolve, reject) => {
		try {
			ticketSchema
				.find({ _id, clientId })
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		} catch (error) {
			reject(error);
		}
	});
};

const updateClientReply = ({ _id, message, sender }) => {
	return new Promise((resolve, reject) => {
		try {
			ticketSchema
				.findOneAndUpdate(
					{ _id },
					{
						status: "Approved",
						$push: {
							conversations: { message, sender },
						},
					},
					{ new: true }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = { insertTicket, getTickets, getTicketById, updateClientReply };
