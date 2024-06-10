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
import getUser from "./getUser";
import expressFileUpload from "express-fileupload";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

const allowedOrigins = [
    'https://blogs-one-tawny.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    statusCode: 429
})

// app.use(limiter);
app.use(express.json({
    limit: '10mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(expressFileUpload({
    useTempFiles: true
}));

app.use(cookieParser());

cron.schedule('* * * * *', deleteExpiredOTPs);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
    console.log("Hello");
})

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get('/getUsername', getUser);

app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
})