import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

interface verification {
    email: string;
    otp: string
}

