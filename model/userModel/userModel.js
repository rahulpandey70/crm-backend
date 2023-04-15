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

const storeJwtRefreshToken = (_id, token) => {
	return new Promise((resolve, reject) => {
		try {
			userSchema
				.findOneAndUpdate(
					{ _id },
					{
						$set: {
							"refreshJWTToken.token": token,
							"refreshJWTToken.addedAt": Date.now(),
						},
					},
					{ new: true }
				)
				.then((data) => resolve(data))

				.catch((err) => reject(err));
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = { insertUser, getUserByEmail, storeJwtRefreshToken };
