const router = require("express").Router();
const {
	insertUser,
	getUserByEmail,
	getUserById,
	updateDbPassword,
} = require("../model/userModel/userModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { createAccessJWT, createRefreshJWT } = require("../helper/jwt");
const { userAuthorization } = require("../middleware/authorization");
const {
	resetPinToSetPass,
	getPin,
	deletePin,
} = require("../model/resetPi/resetPinModel");
const { emailProcess } = require("../helper/email");
const {
	resetPassReqValidation,
	updatePassValidation,
	newUserValidation,
} = require("../middleware/formValidationMiddleware");

router.all("/", (req, res, next) => {
	next();
});

// get a user profile
router.get("/", userAuthorization, async (req, res) => {
	const _id = req.userId;

	const userProfile = await getUserById(_id);

	res.json({ status: "Success", user: userProfile });
});

// create new user
router.post("/", newUserValidation, async (req, res) => {
	const { name, address, email, phone, password } = req.body;
	try {
		// hash password
		const hashPassword = bcrypt.hashSync(password, saltRounds);

		const newUserObj = {
			name,
			address,
			email,
			phone,
			password: hashPassword,
		};

		const newUser = await insertUser(newUserObj);
		res.status(201).json({ msg: "user added successfully", newUser });
	} catch (error) {
		res.status(404).json({ msg: error.message });
	}
});

// login
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.json({ msg: "Please Enter email or password!" });

	// getting email from db
	const user = await getUserByEmail(email);

	const passwordFromDB = user && user._id ? user.password : null;

	if (!passwordFromDB) return res.json({ msg: "Wrong email or password!" });

	// comparing password from db
	const result = await bcrypt.compare(password, passwordFromDB);

	if (!result) {
		return res.status(404).json({ msg: "Your password is wrong!" });
	}

	const accessToken = await createAccessJWT(user.email, `${user._id}`);
	const refreshToken = await createRefreshJWT(user.email, `${user._id}`);

	res.status(200).json({ msg: accessToken, refreshToken });
});

// reset password
router.post("/reset-password", resetPassReqValidation, async (req, res) => {
	const { email } = req.body;

	const user = await getUserByEmail(email);

	if (user && user._id) {
		const setPin = await resetPinToSetPass(email);

		await emailProcess({
			email,
			pin: setPin.pin,
			type: "reset-password-request",
		});

		res.json({
			status: "success",
			message: "Pin sended to your email",
		});
	}
});

// update database with new password
router.patch("/reset-password", updatePassValidation, async (req, res) => {
	const { email, pin, newPassword } = req.body;

	const resetPin = await getPin(email, pin);

	if (resetPin._id) {
		const dbDate = resetPin.addedAt;
		const expiresIn = 1;

		const expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

		const today = new Date();

		if (today > expDate) {
			return res.json({ msg: "Invalid or expired pin" });
		}

		const hashPassword = bcrypt.hashSync(newPassword, saltRounds);

		const user = await updateDbPassword(email, hashPassword);

		await emailProcess({ email, type: "password-update-request" });

		deletePin(email, pin);

		if (user._id) {
			return res.json({
				status: "Success",
				msg: "Your password has been updated",
			});
		}
	}

	res.json({
		status: "Error",
		msg: "Unable to update your password, Please try again later",
	});
});

module.exports = router;
