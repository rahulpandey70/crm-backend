const { resetPinSchema } = require("./resetPinSchema");

const resetPinToSetPass = (email) => {
	const randomPin = (length) => {
		let pin = "";
		for (let i = 0; i < length; i++) {
			pin += Math.floor(Math.random() * 10);
		}
		return pin;
	};

	const resetObj = {
		email,
		pin: randomPin(6),
	};

	return new Promise((resolve, reject) => {
		resetPinSchema(resetObj)
			.save()
			.then((data) => resolve(data))
			.catch((error) => reject(error));
	});
};

module.exports = {
	resetPinToSetPass,
};
