const { verifyJwtAccessToken } = require("../helper/jwt");
const { getAccessJwtFromRedis } = require("../helper/redis");

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
	return res.status(403).json({ msg: "Token is not valid" });
};

module.exports = { userAuthorization };
