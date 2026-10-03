import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        message: "too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export default rateLimiter;