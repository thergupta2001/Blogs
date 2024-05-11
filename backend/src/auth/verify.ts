import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

interface Verification {
    email: string;
    otp: string;
}

interface OTP {
    id: number;
    email: string;
    otp: string;
}

interface User {
    username: string,
    email: string,
    password: string
}

const prisma = new PrismaClient();

export default async function userVerification(req: Request, res: Response) {
    const userVerify: Verification = req.body;

    try {
        const user: OTP | null = await prisma.otps.findFirst({
            where: {
                email: userVerify.email
            }
        });

        // Ensures only existing users receive OTP
        const existingUser: User | null = await prisma.user.findUnique({
            where: {
                email: userVerify.email
            }
        });

        if(!existingUser) {
            return res.status(500).json({
                message: "You do not have an account!",
                success: false,
                path: null
            })
        }

        if (user && user.otp === userVerify.otp) {
            // Delete the prisma otp document
            await prisma.otps.deleteMany({
                where: {
                    email: userVerify.email
                }
            })

            return res.status(200).json({
                message: "User verified successfully",
                success: true,
                path: "/home"
            });
        } else if(user && user.otp !== userVerify.otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
                path: null
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            path: null
        });
    }
}
