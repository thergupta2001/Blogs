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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const sendOTP_1 = __importDefault(require("../utils/sendOTP"));
function resendOtpController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            const otp = (0, generateOTP_1.default)();
            yield (0, sendOTP_1.default)(user === null || user === void 0 ? void 0 : user.email, otp);
            return res.status(200).json({
                message: "An OTP has been sent to your email",
                success: true,
                path: null
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error. Please try again later",
                success: false,
                path: null
            });
        }
    });
}
exports.default = resendOtpController;
