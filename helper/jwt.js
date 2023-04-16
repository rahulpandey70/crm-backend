const jwt = require("jsonwebtoken");
const { setAccessJwtToRedis, getAccessJwtFromRedis } = require("./redis");
const { storeJwtRefreshToken } = require("../model/userModel/userModel");

// create jwt access token
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

// create refresh token
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

// verify jwt token
const verifyJwtAccessToken = (token) => {
	try {
		return Promise.resolve(jwt.verify(token, process.env.JWT_ACCESS_SECRET));
	} catch (error) {
		return Promise.resolve(error);
	}
};

// verify jwt token
const verifyJwtRefreshToken = (token) => {
	try {
		return Promise.resolve(jwt.verify(token, process.env.JWT_REFRESH_SECRET));
	} catch (error) {
		return Promise.resolve(error);
	}
};

module.exports = {
	createAccessJWT,
	createRefreshJWT,
	verifyJwtAccessToken,
	verifyJwtRefreshToken,
};
