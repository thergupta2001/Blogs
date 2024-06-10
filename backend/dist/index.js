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
const getUser_1 = __importDefault(require("./getUser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const allowedOrigins = [
    'https://blogs-one-tawny.vercel.app',
    'http://localhost:5173'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    statusCode: 429
});
// app.use(limiter);
app.use(express_1.default.json({
    limit: '10mb'
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true
}));
app.use((0, cookie_parser_1.default)());
node_cron_1.default.schedule('* * * * *', deleteOtp_1.deleteExpiredOTPs);
app.get("/", (req, res) => {
    res.send("Hello world");
    console.log("Hello");
});
app.use("/auth", router_1.default);
app.use("/user", router_2.default);
app.get('/getUsername', getUser_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});
