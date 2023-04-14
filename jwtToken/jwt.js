const jwt = require("jsonwebtoken");

const createAccessJWT = (payload) => {
	const accessJwtToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: "20m",
	});
	return Promise.resolve(accessJwtToken);
};

const createRefreshJWT = (payload) => {
	const refreshJwtToken = jwt.sign(
		{ payload },
		process.env.JWT_REFRESH_SECRET,
		{
			expiresIn: "30d",
		}
	);
	return Promise.resolve(refreshJwtToken);
};

module.exports = {
	createAccessJWT,
	createRefreshJWT,
};
