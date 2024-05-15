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
function userVerificationController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userVerify = req.body;
        try {
            const user = yield prisma.otps.findFirst({
                where: {
                    email: userVerify.email
                }
            });
            // Ensures only existing users receive OTP
            const existingUser = yield prisma.user.findUnique({
                where: {
                    email: userVerify.email
                }
            });
            if (!existingUser) {
                return res.status(500).json({
                    message: "You do not have an account!",
                    success: false,
                    path: null
                });
            }
            if (!user) {
                return res.status(500).json({
                    message: "Your OTP has already expired!",
                    success: false,
                    path: null
                });
            }
            // console.log("Hello")
            const matchedOtp = yield bcrypt_1.default.compare(userVerify.otp, user.otp);
            if (matchedOtp) {
                // Delete the prisma otp document
                yield prisma.otps.deleteMany({
                    where: {
                        email: userVerify.email
                    }
                });
                // Update user's isVerified flag to true
                yield prisma.user.update({
                    where: {
                        email: existingUser.email
                    },
                    data: {
                        isVerified: true
                    }
                });
                const payload = {
                    username: existingUser.username,
                    email: existingUser.email
                };
                const secret = process.env.JWT_SECRET.toString();
                const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '3d' });
                res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expires in 3 days
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                });
                // console.log(res.cookies.accessToken);
                return res.status(200).json({
                    message: "User verified successfully",
                    success: true,
                    path: "/home"
                });
            }
            else {
                return res.status(400).json({
                    message: "Invalid OTP",
                    success: false,
                    path: null
                });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
                success: false,
                path: null
            });
        }
    });
}
exports.default = userVerificationController;
