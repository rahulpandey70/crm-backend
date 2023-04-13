const router = require("express").Router();

router.all("/", (req, res) => {
	res.json({ msg: "hello from ticket router" });
});

module.exports = router;
