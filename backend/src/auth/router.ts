import express from "express";
import SignupController from "./signup";
import LoginController from "./login";

const authRouter = express.Router();

authRouter.post("/signup", SignupController);
authRouter.post("/login", LoginController);

export default authRouter;