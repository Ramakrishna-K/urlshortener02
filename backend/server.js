import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

import urlRoutes from "./routes/urlRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";

import { redirectUrl } from "./controllers/urlController.js";

const app = express();

const PORT = process.argv[2] || process.env.PORT || 5000;
const SERVER_NAME = `server-${PORT}`;

// ==========================================
// TRUST NGINX PROXYv
// ==========================================

app.set("trust proxy", 1);

// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

// ==========================================
// JSON BODY PARSER
// ==========================================

app.use(express.json());

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: `${SERVER_NAME} is working. I am Ramakrishna`
    });
});

// ==========================================
// URL API ROUTES
// ==========================================

app.use(
    "/api/urls",
    rateLimiter,
    urlRoutes
);

// ==========================================
// SHORT URL REDIRECT
// ==========================================

app.get(
    "/:shortCode",
    redirectUrl
);

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
    try {
        await connectDB();

        await connectRedis();

        app.listen(PORT, () => {
            console.log(
                `${SERVER_NAME} is running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );
    }
};

startServer();