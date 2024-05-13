import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

interface ChangePassword {
    email: string;
    otp: string;
    password: string
}

interface User {
    username: string,
    email: string,
    password: string
}

interface OTP {
    id?: number;
    email: string;
    otp: string;
}

const prisma = new PrismaClient();

export default async function changePassController(req: Request, res: Response) {
    const userChangePass: ChangePassword = req.body;

    try {
        // Checks if the user exists
        const existingUser: User | null = await prisma.user.findUnique({
            where: {
                email: userChangePass?.email
            }
        });

        if (!existingUser) {
            return res.status(500).json({
                message: "You do not have an account!",
                success: false,
                path: null
            })
        }

        // Checks OTP verification
        const userOTP: OTP | null = await prisma.otps.findFirst({
            where: {
                email: userChangePass.email
            }
        });

        if (userOTP) {
            const matchedOtp = await bcrypt.compare(userChangePass.otp, userOTP.otp);

            if (matchedOtp) {
                // Delete the prisma otp document
                await prisma.otps.deleteMany({
                    where: {
                        email: userChangePass.email
                    }
                })

                const newHashedPassword = await bcrypt.hash(userChangePass.password, 10);

                // Update user's isVerified flag to true
                await prisma.user.update({
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
            } else {
                return res.status(400).json({
                    message: "Invalid OTP",
                    success: false,
                    path: null
                })
            }
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