import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./auth/router";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import { deleteExpiredOTPs } from "./auth/deleteOtp";
import userRouter from "./user/router";
import jwt, { JwtPayload, decode } from "jsonwebtoken";

dotenv.config();

interface DecodedToken extends JwtPayload {
    username: string;
    email: string
}

const app = express();

const prisma = new PrismaClient();

const allowedOrigins = [
    'https://blogs-one-tawny.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: ["https://blogs-one-tawny.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    statusCode: 429
})

// app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://blogs-one-tawny.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

app.use(cookieParser());

cron.schedule('* * * * *', deleteExpiredOTPs);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
    console.log("Hello");
})

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get('/getUsername', (req: Request, res: Response) => {

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
});

app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
})