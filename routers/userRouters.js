const router = require("express").Router();
const {
	insertUser,
	getUserByEmail,
	getUserById,
} = require("../model/userModel/userModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { createAccessJWT, createRefreshJWT } = require("../helper/jwt");
const { userAuthorization } = require("../middleware/authorization");

router.all("/", (req, res, next) => {
	next();
});

// get a user profile
router.get("/", userAuthorization, async (req, res) => {
	const _id = req.userId;

	const userProfile = await getUserById(_id);

	res.json({ user: userProfile });
});

// create new user
router.post("/", async (req, res) => {
	const { name, address, email, phone, password } = req.body;
	try {
		// hash password
		const hashPassword = await bcrypt.hashSync(password, saltRounds);

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

	res.status(200).json({ msg: result, user, accessToken, refreshToken });
});

module.exports = router;
