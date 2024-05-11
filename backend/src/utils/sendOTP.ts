import nodemailer from "nodemailer";

export default async function sendOTPByMail(email: string, OTP: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASS
        }
    })

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'OTP for Signup',
        text: `Your OTP for signup is: ${OTP}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
}