import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendOTPByMail from "../utils/sendOTP";
import generateOTP from "../utils/generateOTP";

interface User {
    email: string;
    username?: string;
    password: string
}

const prisma = new PrismaClient();

export default async function LoginController(req: Request, res: Response) {
    try {
        const user: User = req.body;

        if (!user.email || !user.password) {
            return res.json({
                message: "Please provide all the credentials!",
                success: false,
                path: null
            })
        }

        // Checks if the user exists
        const existingUser: User | null = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found! Please register",
                success: false,
                path: "/signup"
            })
        }

        // Checks for valid credentials
        const matchedPassword: boolean = await bcrypt.compare(user.password, existingUser.password);

        if (!matchedPassword) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
                path: null
            })
        }

        // Sends otp to the user
        const otp = generateOTP();

        await sendOTPByMail(user.email, otp);

        return res.status(200).json({
            message: "An OTP has been sent to your email",
            success: true,
            path: "/verify"
        })
    } catch (error: unknown) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error. Please try again later",
            success: false,
            path: null
        })
    }
}