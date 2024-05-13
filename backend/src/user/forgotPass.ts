import { Request, Response } from "express";
import generateOTP from "../utils/generateOTP";
import sendOTPByMail from "../utils/sendOTP";

interface user {
    email: string;
}

export default async function forgotPassController(req: Request, res: Response) {
    try {
        const userEmail: user = req.body;

        const OTP = generateOTP();

        await sendOTPByMail(userEmail?.email, OTP);

        return res.status(200).json({
            message: "An OTP has been sent to your mail.",
            success: true,
            path: "/change"
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error. Please try again later",
            success: false,
            path: null
        })
    }
}