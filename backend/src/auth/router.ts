import express from "express";
import SignupController from "./signup";
import LoginController from "./login";
import userVerificationController from "./verify";

const authRouter = express.Router();

authRouter.post("/signup", SignupController);
authRouter.post("/login", LoginController);
authRouter.post("/verify", userVerificationController);

export default authRouter;