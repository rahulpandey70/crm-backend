const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// api security
app.use(helmet());

// cors
app.use(cors());

// logger
app.use(morgan());

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// port
const PORT = 5000 || process.env.PORT;

// router
app.get("/", (req, res) => {
	res.json({ message: "Api is running!!" });
});

// server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
