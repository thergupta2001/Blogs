import express from "express";
import SignupController from "./signup";

const authRouter = express.Router();

authRouter.post("/signup", SignupController);

export default authRouter;