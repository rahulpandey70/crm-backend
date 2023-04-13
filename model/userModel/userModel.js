const { userSchema } = require("./userSchema");

const insertUser = (userObj) => {
	return new Promise((resolve, reject) => {
		userSchema(userObj)
			.save()
			.then((data) => resolve(data))
			.catch((error) => reject(error));
	});
};

const getUserByEmail = (email) => {
	return new Promise((resolve, reject) => {
		if (!email) return new Error("Email not found!");

		try {
			userSchema
				.findOne({ email })
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

module.exports = { insertUser, getUserByEmail };
