import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface User {
    username: string,
    email: string,
    password: string
}

function isValidEmail(email: string): boolean {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default async function SignupController(req: Request, res: Response) {
    try {
        const user: User = req.body;

        if (!user.username || !user.email || !user.password) {
            return res.json({
                message: "Please provide all the credentials!",
                success: false,
                path: null
            })
        }

        if (!isValidEmail(user.email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
                path: null
            })
        }

        if (prisma.user) {
            // Checks for an existing user
            const existingUser: User | null = await prisma.user.findUnique({
                where: {
                    email: user.email
                }
            });

            if ((existingUser?.email === user.email) && (existingUser.username !== user.username)) {
                return res.status(409).json({
                    message: "Email is already in use! Please try another one.",
                    success: false,
                    path: null
                })
            }

            if ((existingUser?.email === user.email) && (existingUser.username === user.username)) {
                return res.status(409).json({
                    message: "You already have an account! Please login.",
                    success: false,
                    path: "/"
                })
            }
        }

        const hashedPassword: string = (await bcrypt.hash(user.password, 10)).toString();

        // Creates a new user
        const newUser = await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: hashedPassword
            }
        })

        return res.status(200).json({
            message: "User created successfully",
            success: true,
            path: "/"
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
            path: null
        })
    }
}