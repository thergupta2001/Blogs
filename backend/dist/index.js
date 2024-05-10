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
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
    statusCode: 429
});
// app.use(limiter);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Hello world");
    console.log("Hello");
});
app.use("/auth", router_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});
