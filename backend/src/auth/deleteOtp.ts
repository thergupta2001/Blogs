const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

interface otp {
    id: number;
    otp: string;
    email?: string;
}

export async function deleteExpiredOTPs() {
    try {
        const deviceTime = new Date().toISOString();
        // console.log(deviceTime);

        const otps = await prisma.otps.findMany();

        for (const otp of otps) {
            // console.log(otp.expiration);

            // Calaculates time difference
            const timeDifference = new Date(deviceTime).getTime() - new Date(otp.expiration).getTime();
            const expiryTime = 5 * 60 * 1000; // 5 minutes

            if (timeDifference > expiryTime) {
                // Delete the OTP row
                await prisma.otps.delete({
                    where: {
                        id: otp.id
                    }
                });

                console.log(`Expired OTP deleted: ${otp.id}`);
            }
        }

        // console.log("Expired OTPs deleted successfully.");
    } catch (error) {
        console.error("Error deleting expired OTPs:", error);
    } finally {
        await prisma.$disconnect();
    }
}