import express from "express";
import forgotPassController from "./forgotPass";
import changePassController from "./changePass";
import fileUploadController from "./fileUpload";

const userRouter = express.Router();

userRouter.post("/forgot", forgotPassController);
userRouter.put("/change", changePassController);
userRouter.post("/upload", fileUploadController);

export default userRouter;