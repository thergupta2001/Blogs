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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function userVerification(req, res) {
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
            if (user && user.otp === userVerify.otp) {
                // Delete the prisma otp document
                yield prisma.otps.deleteMany({
                    where: {
                        email: userVerify.email
                    }
                });
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
exports.default = userVerification;
