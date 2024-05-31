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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.accessToken;
        if (!token) {
            // console.log("why the hell is token empty!!");
            return res.status(404).json({
                message: "Unauthorized user",
                success: false,
                path: null
            });
        }
        try {
            const secret = process.env.JWT_SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return res.status(200).json({
                message: 'User info retrieved successfully',
                success: true,
                data: {
                    username: decoded.username,
                    email: decoded.email,
                },
            });
        }
        catch (error) {
            return res.status(401).json({
                message: 'Token is not valid',
                success: false,
                path: null
            });
        }
    });
}
exports.default = getUser;
