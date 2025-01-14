// У app.js - веб сервер на express і прошарки morgan і cors.
import express, { json } from "express";
import logger from "morgan";
import cors from "cors";

// set of route handlers
import authRouter from "./routes/api/auth-router.js";
import contactsRouter from "./routes/api/contacts-router.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// middlewares
app.use(logger(formatsLogger));
app.use(cors());
app.use(json());
app.use(express.static("public"));

app.use((req, res, next) => {
	console.log("CONSOLE EVERY REQ>>", req.params, req.body);
	next();
});

// router for user authentication
app.use("/api/users", authRouter);

// router for "/api/contacts" endpoint
app.use("/api/contacts", contactsRouter);

// "not found" handler
app.use((req, res) => {
	console.log("NOT FOUND>>req.param", req.params, req.body);
	res.status(404).json({ message: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});

export default app;

