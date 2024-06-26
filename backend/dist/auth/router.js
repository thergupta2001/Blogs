"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const verify_1 = __importDefault(require("./verify"));
const authRouter = express_1.default.Router();
authRouter.post("/signup", signup_1.default);
authRouter.post("/login", login_1.default);
authRouter.post("/verify", verify_1.default);
exports.default = authRouter;
