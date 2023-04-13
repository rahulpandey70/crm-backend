const router = require("express").Router();
const { insertUser } = require("../model/userModel/userModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.all("/", (req, res, next) => {
	next();
});

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
		res.json({ msg: "user added successfully", newUser });
	} catch (error) {
		res.json({ msg: error.message });
	}
});

module.exports = router;
