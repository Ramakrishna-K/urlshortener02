

import redisClient from "../config/redis.js";
import generateCode from "../utils/generateCode.js";
import Url from "../models/Url.js";

// ========================================
// POST /api/urls/shorten
// ========================================

export const shortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        // Validate request
        if (!originalUrl || !originalUrl.trim()) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        }

        // Generate short code
        const shortCode = generateCode();

        // ========================================
        // Save URL to MongoDB
        // ========================================

        const newUrl = await Url.create({
            originalUrl: originalUrl.trim(),
            shortCode
        });

        // ========================================
        // MongoDB diagnostic information
        // ========================================

        console.log("=================================");
        console.log("MONGODB SAVE SUCCESS");
        console.log("ID:", newUrl._id);
        console.log("Original URL:", newUrl.originalUrl);
        console.log("Short Code:", newUrl.shortCode);
        console.log("Database:", Url.db.name);
        console.log("Collection:", Url.collection.name);
        console.log("=================================");

        // ========================================
        // Save URL to Redis
        // ========================================

        await redisClient.set(
            shortCode,
            originalUrl.trim()
        );

        console.log("REDIS SAVE SUCCESS:", shortCode);

        // ========================================
        // Send response
        // ========================================

        return res.status(201).json({
            message: "URL shortened successfully",
            data: newUrl
        });

    } catch (error) {
        console.error("=================================");
        console.error("SHORTEN URL ERROR");
        console.error(error);
        console.error("=================================");

        return res.status(500).json({
            message: "Failed to shorten URL",
            error: error.message
        });
    }
};


// ========================================
// GET /:shortCode
// ========================================

export const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        console.log("Redirect request for:", shortCode);

        // ========================================
        // 1. Check Redis
        // ========================================

        const cachedUrl = await redisClient.get(shortCode);

        if (cachedUrl) {
            console.log("REDIS CACHE HIT:", shortCode);

            // Find MongoDB document
            // We need MongoDB because clicks must be updated
            const url = await Url.findOne({
                shortCode
            });

            if (!url) {
                return res.status(404).json({
                    message: "Short URL not found"
                });
            }

            // Increase click count
            url.clicks += 1;

            await url.save();

            console.log("CLICK COUNT:", url.clicks);

            // Redirect using Redis cached URL
            return res.redirect(cachedUrl);
        }

        // ========================================
        // 2. Redis Cache Miss
        // ========================================

        console.log("REDIS CACHE MISS:", shortCode);

        // Find URL in MongoDB
        const url = await Url.findOne({
            shortCode
        });

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        // ========================================
        // 3. Store URL in Redis
        // ========================================

        await redisClient.set(
            shortCode,
            url.originalUrl
        );

        console.log(
            "URL ADDED TO REDIS:",
            shortCode
        );

        // ========================================
        // 4. Increase click count
        // ========================================

        url.clicks += 1;

        await url.save();

        console.log("CLICK COUNT:", url.clicks);

        // ========================================
        // 5. Redirect
        // ========================================

        return res.redirect(url.originalUrl);

    } catch (error) {
        console.error("=================================");
        console.error("REDIRECT ERROR");
        console.error(error);
        console.error("=================================");

        return res.status(500).json({
            message: "Failed to redirect",
            error: error.message
        });
    }
};


// ========================================
// GET /api/urls/stats/:shortCode
// ========================================

export const getUrlStats = async (req, res) => {
    try {
        const { shortCode } = req.params;

        // Find URL in MongoDB
        const url = await Url.findOne({
            shortCode
        });

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        // Return statistics
        return res.status(200).json({
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            clicks: url.clicks,
            createdAt: url.createdAt
        });

    } catch (error) {
        console.error("=================================");
        console.error("STATS ERROR");
        console.error(error);
        console.error("=================================");

        return res.status(500).json({
            message: "Failed to get URL statistics",
            error: error.message
        });
    }
};
