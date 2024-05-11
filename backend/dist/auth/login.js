"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
function LoginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        if (!user.email || !user.password) {
            return res.json({
                message: "Please provide all the credentials!",
                success: false,
                path: null
            });
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                email: user.email
            }
        });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found! Please register",
                success: false,
                path: "/signup"
            });
        }
        // Checks for valid credentials
        const matchedPassword = yield bcrypt_1.default.compare(user.password, existingUser.password);
        if (!matchedPassword) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
                path: null
            });
        }
        // Checks for valid otp
        const payload = {
            username: existingUser.username,
            email: existingUser.email
        };
        const secret = process.env.JWT_SECRET.toString();
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '3d' });
        res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // cookie expiry in 3 days
        });
    });
}
exports.default = LoginController;
