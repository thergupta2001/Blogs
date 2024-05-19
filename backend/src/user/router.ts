import express from "express";
import forgotPassController from "./forgotPass";
import changePassController from "./changePass";

const userRouter = express.Router();

userRouter.post("/forgot", forgotPassController);
userRouter.put("/change", changePassController);

export default userRouter;