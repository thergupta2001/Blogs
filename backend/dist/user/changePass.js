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
const prisma = new client_1.PrismaClient();
function changePassController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userChangePass = req.body;
        try {
            // Checks if the user exists
            const existingUser = yield prisma.user.findUnique({
                where: {
                    email: userChangePass === null || userChangePass === void 0 ? void 0 : userChangePass.email
                }
            });
            if (!existingUser) {
                return res.status(500).json({
                    message: "You do not have an account!",
                    success: false,
                    path: null
                });
            }
            // Checks OTP verification
            const userOTP = yield prisma.otps.findFirst({
                where: {
                    email: userChangePass.email
                }
            });
            if (userOTP) {
                const matchedOtp = yield bcrypt_1.default.compare(userChangePass.otp, userOTP.otp);
                if (matchedOtp) {
                    // Delete the prisma otp document
                    yield prisma.otps.deleteMany({
                        where: {
                            email: userChangePass.email
                        }
                    });
                    const newHashedPassword = yield bcrypt_1.default.hash(userChangePass.password, 10);
                    // Update user's isVerified flag to true
                    yield prisma.user.update({
                        where: {
                            email: existingUser.email
                        },
                        data: {
                            password: newHashedPassword,
                            isVerified: true,
                        }
                    });
                    return res.status(200).json({
                        message: "Password changed successfully",
                        success: true,
                        path: "/"
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
exports.default = changePassController;
