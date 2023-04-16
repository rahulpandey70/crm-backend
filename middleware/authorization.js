const { verifyJwtAccessToken } = require("../helper/jwt");
const {
	getAccessJwtFromRedis,
	deleteOldJwtTokenfromRedis,
} = require("../helper/redis");

const userAuthorization = async (req, res, next) => {
	const { authorization } = req.headers;

	const decodedToken = await verifyJwtAccessToken(authorization);

	if (decodedToken.email) {
		const userId = await getAccessJwtFromRedis(authorization);

		if (!userId) {
			return res.status(403).json({ msg: "forbidden" });
		}

		req.userId = userId;

		return next();
	}

	deleteOldJwtTokenfromRedis(authorization);

	res.status(403).json({ msg: "Token is not valid" });
};

module.exports = { userAuthorization };
