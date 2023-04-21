const router = require("express").Router();
const { verifyJwtRefreshToken, createAccessJWT } = require("../helper/jwt");
const { getUserByEmail } = require("../model/userModel/userModel");

// refresh token
router.get("/", async (req, res) => {
	const { authorization } = req.headers;

	const decodedRefreshToken = await verifyJwtRefreshToken(authorization);

	if (decodedRefreshToken.email) {
		const userProfile = await getUserByEmail(decodedRefreshToken.email);
		if (userProfile._id) {
			let tokenCreatedAt = userProfile.refreshJWTToken.addedAt;
			const dbRefreshToken = userProfile.refreshJWTToken.token;

			tokenCreatedAt = tokenCreatedAt.setDate(
				tokenCreatedAt.getDate() + +process.env.JWT_REFRESH_EXP_DATE
			);

			const today = new Date();

			if (dbRefreshToken !== authorization && tokenCreatedAt < today) {
				return res.status(403).json({
					status: "error",
					message: "Refresh token is expired! Please login again.",
				});
			}

			const accessJwtToken = await createAccessJWT(
				decodedRefreshToken.email,
				userProfile._id.toString()
			);

			return res.json({ status: "success", accessJwtToken });
		}
	}

	res.json({ status: "error", message: "Refresh token is not valid." });
});

module.exports = router;
