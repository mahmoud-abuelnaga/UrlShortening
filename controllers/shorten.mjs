// imports
import express from "express";
import { urlModel } from "../models/url.mjs";

// constants
const BASE62_ENCODING =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// controllers
async function createShortUrl(req, res, next) {
    function createHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            hash = (hash << 5) - hash + charCode;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // don't forget to do validation for url -> check if it's a valid url
    function createShortCode(number) {
        let shortCode = "";
        while (number > 0) {
            let rem = number % 62;
            number = Math.floor(number / 62);
            shortCode = BASE62_ENCODING[rem] + shortCode;
        }

        return shortCode;
    }

    // create new Url Object
    const newUrl = await urlModel.create(req.body); // TODO: catch error in case of failure in saving the document

    // create a shortcode for it and save it    TODO: catch errors
    newUrl.shortCode = createShortCode(createHash(newUrl._id.toString()));
    await newUrl.save();

    return res.status(200).json(newUrl);
}

/*
Returns a JSON response with the original url that correponds to the short one

@param {express.Request} req - Express Request Object
@param {express.Response} res - Express Response Object
@param {express.NextFunction} - Express NextFunction
*/
function getOriginalUrl(req, res, next) {}

function updateUrl(req, res, next) {}

function deleteUrl(req, res, next) {}

function getUrlStats(req, res, next) {}

export { createShortUrl, getOriginalUrl, updateUrl, deleteUrl, getUrlStats };
