"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./auth/router"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const node_cron_1 = __importDefault(require("node-cron"));
const deleteOtp_1 = require("./auth/deleteOtp");
const router_2 = __importDefault(require("./user/router"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    statusCode: 429
});
// app.use(limiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
node_cron_1.default.schedule('* * * * *', deleteOtp_1.deleteExpiredOTPs);
app.get("/", (req, res) => {
    res.send("Hello world");
    console.log("Hello");
});
app.use("/auth", router_1.default);
app.use("/user", router_2.default);
app.get('/getUsername', (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("why the hell is token empty!!");
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
app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});
