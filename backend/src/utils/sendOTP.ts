import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function sendOTPByMail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASS
        }
    })

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'OTP for Signup',
        text: `Your OTP for signup is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);

        console.log("Hello");

        // Creates an otp model here
        await prisma.otps.create({
            data: {
                email: email,
                otp: otp,
                expiration: new Date(Date.now() + 5 * 60 * 1000)
            }
        });

        return;
    } catch (error: unknown) {
        const response = {
            message: "Error sending OTP, please try again later.",
            success: false,
            path: null
        }

        console.error('Error sending OTP email:', error);

        return response;
    }
}