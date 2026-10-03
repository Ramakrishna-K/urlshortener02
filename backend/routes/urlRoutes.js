import  express from "express";

import {  shortenUrl,redirectUrl,getUrlStats} from "../controllers/urlController.js";

const router = express.Router();


router.post("/shorten", shortenUrl);

router.get("/:shortCode/stats",getUrlStats);

router.get("/:shortCode", redirectUrl);

export default router;