import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
    email: string;
    username?: string;
    password: string
}

const prisma = new PrismaClient();

export default async function LoginController (req: Request, res: Response) {
    const user: User = req.body;

    if (!user.email || !user.password) {
        return res.json({
            message: "Please provide all the credentials!",
            success: false,
            path: null
        })
    }

    const existingUser: User | null = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })

    if(!existingUser) {
        return res.status(404).json({
            message: "User not found! Please register",
            success: false,
            path: "/signup"
        })
    }

    // Checks for valid credentials
    const matchedPassword: boolean = await bcrypt.compare(user.password, existingUser.password);

    if(!matchedPassword) {
        return res.status(401).json({
            message: "Invalid credentials",
            success: false,
            path: null
        })
    }

    // Checks for valid otp
    

    const payload = {
        username: existingUser.username,
        email: existingUser.email
    }

    const secret: string | null = process.env.JWT_SECRET!.toString();

    const token = jwt.sign(payload, secret, { expiresIn: '3d' });

    res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // cookie expiry in 3 days
    })
}