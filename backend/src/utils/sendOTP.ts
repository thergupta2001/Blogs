import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
        text: `Your OTP for signup is: ${otp}. This OTP expires in 5 minutes.`
    };

    try {
        const hashedOtp: string = (await bcrypt.hash(otp, 10)).toString();

        await transporter.sendMail(mailOptions);

        await prisma.otps.deleteMany({
            where: {
                email: email
            }
        })

        // Creates an otp model here
        const deviceTimeAsString = new Date().toISOString();

        await prisma.otps.create({
            data: {
                email: email,
                otp: hashedOtp,
                expiration: deviceTimeAsString
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