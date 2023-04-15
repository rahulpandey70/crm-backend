const jwt = require("jsonwebtoken");
const { setAccessJwtToRedis, getAccessJwtFromRedis } = require("./redis");
const { storeJwtRefreshToken } = require("../model/userModel/userModel");

const createAccessJWT = async (email, _id) => {
	try {
		const accessJwtToken = await jwt.sign(
			{ email },
			process.env.JWT_ACCESS_SECRET,
			{
				expiresIn: "20m",
			}
		);

		setAccessJwtToRedis(accessJwtToken, _id);

		return Promise.resolve(accessJwtToken);
	} catch (error) {
		return Promise.reject(error);
	}
};

const createRefreshJWT = async (email, _id) => {
	try {
		const refreshJwtToken = jwt.sign(
			{ email },
			process.env.JWT_REFRESH_SECRET,
			{
				expiresIn: "30d",
			}
		);

		storeJwtRefreshToken(_id, refreshJwtToken);

		return Promise.resolve(refreshJwtToken);
	} catch (error) {
		return Promise.reject(error);
	}
};

module.exports = {
	createAccessJWT,
	createRefreshJWT,
};
