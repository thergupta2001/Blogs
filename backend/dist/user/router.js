"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forgotPass_1 = __importDefault(require("./forgotPass"));
const changePass_1 = __importDefault(require("./changePass"));
const userRouter = express_1.default.Router();
userRouter.post("/forgotPass", forgotPass_1.default);
userRouter.put("/changePass", changePass_1.default);
exports.default = userRouter;
