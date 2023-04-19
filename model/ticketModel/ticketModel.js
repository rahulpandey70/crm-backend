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

module.exports = { insertTicket, getTickets };
