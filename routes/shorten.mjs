// imports
import express from "express";
import {
    getOriginalUrl,
    getUrlStats,
    deleteUrl,
    updateUrl,
    createShortUrl,
} from "../controllers/shorten.mjs";
import { validateUrl } from "../middlewares/shorten.mjs";

const router = express.Router();
router.get("/:shortUrl/stats", getUrlStats);
router.route("/:shortUrl").get(getOriginalUrl).put(updateUrl).delete(deleteUrl);
router.post("/", validateUrl, createShortUrl);

export { router as shortenRouter };
