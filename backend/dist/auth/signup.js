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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function SignupController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            if (!user.username || !user.email || !user.password) {
                return res.json({
                    message: "Please provide all the credentials!",
                    success: false,
                    path: null
                });
            }
            if (prisma.user) {
                // Checks for an existing user
                const existingUser = yield prisma.user.findUnique({
                    where: {
                        email: user.email
                    }
                });
                if (((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === user.email) && (existingUser.username !== user.username)) {
                    return res.status(409).json({
                        message: "Email is already in use! Please try another one.",
                        success: false,
                        path: null
                    });
                }
                if (((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === user.email) && (existingUser.username === user.username)) {
                    return res.status(409).json({
                        message: "You already have an account! Please login.",
                        success: false,
                        path: "/login"
                    });
                }
            }
            const newUser = yield prisma.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    password: user.password
                }
            });
            return res.status(200).json({
                message: "User created successfully",
                success: true,
                path: "/home"
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal server error",
                success: false,
                path: null
            });
        }
    });
}
exports.default = SignupController;
