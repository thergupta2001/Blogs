import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
    username: string,
    email: string,
    password: string
}

export default async function SignupController(req: Request, res: Response) {
    try {
        const user: User = req.body;

        if(!user.username || !user.email || !user.password) {
            return res.json({
                message: "Please provide all the credentials!",
                success: false,
                path: null
            })
        }

        if(prisma.user) {
            // Checks for an existing user
            const existingUser: User | null = await prisma.user.findUnique({
                where: {
                    email: user.email
                }
            });

            if((existingUser?.email === user.email) && (existingUser.username !== user.username)) {
                return res.status(409).json({
                    message: "Email is already in use! Please try another one.",
                    success: false,
                    path: null
                })
            }

            if((existingUser?.email === user.email) && (existingUser.username === user.username)) {
                return res.status(409).json({
                    message: "You already have an account! Please login.",
                    success: false,
                    path: "/login"
                })
            }
        }

        const newUser = await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password
            }
        })

        return res.status(200).json({
            message: "User created successfully",
            success: true,
            path: "/home"
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