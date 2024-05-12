"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpiredOTPs = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
function deleteExpiredOTPs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deviceTime = new Date().toISOString();
            // console.log(deviceTime);
            const otps = yield prisma.otps.findMany();
            for (const otp of otps) {
                // console.log(otp.expiration);
                // Calaculates time difference
                const timeDifference = new Date(deviceTime).getTime() - new Date(otp.expiration).getTime();
                const expiryTime = 5 * 60 * 1000; // 5 minutes
                if (timeDifference > expiryTime) {
                    // Delete the OTP row
                    yield prisma.otps.delete({
                        where: {
                            id: otp.id
                        }
                    });
                    console.log(`Expired OTP deleted: ${otp.id}`);
                }
            }
            // console.log("Expired OTPs deleted successfully.");
        }
        catch (error) {
            console.error("Error deleting expired OTPs:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.deleteExpiredOTPs = deleteExpiredOTPs;
