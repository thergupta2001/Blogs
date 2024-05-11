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
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function sendOTPByMail(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASS
            }
        });
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'OTP for Signup',
            text: `Your OTP for signup is: ${otp}`
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log("Hello");
            // Creates an otp model here
            yield prisma.otps.create({
                data: {
                    email: email,
                    otp: otp,
                    expiration: new Date(Date.now() + 5 * 60 * 1000)
                }
            });
            return;
        }
        catch (error) {
            const response = {
                message: "Error sending OTP, please try again later.",
                success: false,
                path: null
            };
            console.error('Error sending OTP email:', error);
            return response;
        }
    });
}
exports.default = sendOTPByMail;
