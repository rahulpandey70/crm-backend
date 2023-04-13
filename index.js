require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const userRouter = require("./routers/userRouters");
const ticketRouter = require("./routers/ticketRouters");
const handleError = require("./utils/errorHandlers");

const mongoose = require("mongoose");

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

// connect to mongodb
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("mongodb connected"));

// port
const PORT = 5000 || process.env.PORT;

// router
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

app.use("*", (req, res, next) => {
	const error = new Error("Path not found!");
	error.status = 404;
	next(handleError(error, res));
});

// server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
