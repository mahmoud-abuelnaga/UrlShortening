// imports
import express from "express";
import { urlModel } from "../models/url.mjs";
import { StatusCodes } from "http-status-codes";

// constants
const BASE62_ENCODING =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// controllers
/**
 * Creates a short code for the url in the request body and responds with a JSON response with the original url and the short code
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
async function createShortUrl(req, res, next) {
    if (req.errors.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid Request",
            errors: req.errors,
        });
    }

    // check if the url to shorten already exists in the database
    try {
        const existingUrl = await urlModel.findOne({
            $or: [{ url: req.body.url }, { url: replacehttp(req.body.url) }],
        });
        if (existingUrl) {
            return res.status(StatusCodes.OK).json({
                url: existingUrl.url,
                shortCode: existingUrl.shortCode,
                createdAt: existingUrl.createdAt,
                updatedAt: existingUrl.updatedAt,
            });
        }
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Database Error",
            errors: ["Error while accessing the database"],
        });
    }

    // create new Url Object
    let newUrl;
    try {
        newUrl = await urlModel.create(req.body);
        // create a shortcode for it and save it
        newUrl.shortCode = createShortCode(createHash(newUrl._id.toString()));
        await newUrl.save();
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            errors: ["Error while creating the short url"],
        });
    }

    return res.status(StatusCodes.CREATED).json({
        url: newUrl.url,
        shortCode: newUrl.shortCode,
        createdAt: newUrl.createdAt,
        updatedAt: newUrl.updatedAt,
    });
}

/**
 * Responds with a JSON that carries the the original url that corresponds to the short one
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
function getOriginalUrl(req, res, next) {}

function updateUrl(req, res, next) {}

function deleteUrl(req, res, next) {}

function getUrlStats(req, res, next) {}

export { createShortUrl, getOriginalUrl, updateUrl, deleteUrl, getUrlStats };

// <------------------ Helper Functions ------------------>
/**
 * Creates a hash from a string
 *
 * @param {String} str - The string to hash
 * @returns {Number}
 */
function createHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        hash = (hash << 5) - hash + charCode;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Takes a number and convert it to base62 encoding
 *
 * @param {Number} number - Number to conver to short code
 * @returns {String}
 */
function createShortCode(number) {
    let shortCode = "";
    while (number > 0) {
        let rem = number % 62;
        number = Math.floor(number / 62);
        shortCode = BASE62_ENCODING[rem] + shortCode;
    }

    return shortCode;
}

/**
 * Replaces http of the protocol with https and vice versa
 *
 * @param {String} url  - The url to replace its protocol
 * @returns {String}
 */
function replacehttp(url) {
    if (url.includes("https")) {
        return url.replace("https", "http");
    } else if (url.includes("http")) {
        return url.replace("http", "https");
    }

    return url;
}
