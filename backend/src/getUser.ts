import { Request, Response } from "express";
import jwt, { JwtPayload, decode } from "jsonwebtoken";

interface DecodedToken {
    username: string;
    email: string
}

export default async function getUser(req: Request, res: Response) {
    const token = req.cookies.accessToken;

    if (!token) {
        // console.log("why the hell is token empty!!");
        return res.status(404).json({
            message: "Unauthorized user",
            success: false,
            path: null
        })
    }

    try {
        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret) as DecodedToken;

        return res.status(200).json({
            message: 'User info retrieved successfully',
            success: true,
            data: {
                username: decoded.username,
                email: decoded.email,
            },
        });
    } catch (error) {
        return res.status(401).json({
            message: 'Token is not valid',
            success: false,
            path: null
        });
    }
}