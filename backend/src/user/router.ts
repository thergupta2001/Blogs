import express from "express";
import forgotPassController from "./forgotPass";
import changePassController from "./changePass";

const userRouter = express.Router();

userRouter.post("/forgotPass", forgotPassController);
userRouter.put("/changePass", changePassController);

export default userRouter;