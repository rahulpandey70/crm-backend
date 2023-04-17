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

const getPin = (email, pin) => {
	return new Promise((resolve, reject) => {
		try {
			resetPinSchema
				.findOne({ email, pin })
				.then((data) => {
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		} catch (error) {
			reject(error);
		}
	});
};

const deletePin = (email, pin) => {
	try {
		resetPinSchema
			.findOneAndDelete({ email, pin })
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	resetPinToSetPass,
	getPin,
	deletePin,
};
