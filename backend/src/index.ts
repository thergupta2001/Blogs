import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./auth/router";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import { deleteExpiredOTPs } from "./auth/deleteOtp";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
    statusCode: 429
})

// app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

cron.schedule('* * * * *', deleteExpiredOTPs);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
    console.log("Hello");
})

app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
})