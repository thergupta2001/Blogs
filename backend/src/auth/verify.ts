import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Verification {
    email: string;
    otp: string;
}

interface OTP {
    id?: number;
    email: string;
    otp: string;
}

interface User {
    username: string,
    email: string,
    password: string
}

const prisma = new PrismaClient();

export default async function userVerificationController(req: Request, res: Response) {
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

        if (!existingUser) {
            return res.status(500).json({
                message: "You do not have an account!",
                success: false,
                path: null
            })
        }

        if (!user) {
            return res.status(500).json({
                message: "Your OTP has already expired!",
                success: false,
                path: null
            })
        }

        // console.log("Hello")
        const matchedOtp = await bcrypt.compare(userVerify.otp, user.otp);

        if (matchedOtp) {
            // Delete the prisma otp document
            await prisma.otps.deleteMany({
                where: {
                    email: userVerify.email
                }
            })

            // Update user's isVerified flag to true
            await prisma.user.update({
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
            }

            const secret = process.env.JWT_SECRET!.toString();

            const token = jwt.sign(payload, secret, { expiresIn: '3d' })

            res.cookie("accessToken", token, {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expires in 3 days
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })

            // console.log(res.cookies.accessToken);

            return res.status(200).json({
                message: "User verified successfully",
                success: true,
                path: "/home"
            });
        } else {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
                path: null
            })
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
