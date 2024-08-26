// imports
import express from "express";
import { URL } from "url";

/**
 * Formats the url by adding http:// if it doesn't exist, trims the url and removes `www.`
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
function formatUrl(req, res, next) {
    if (!req.body.url) {
        return next();
    }

    req.body.url = req.body.url.trim().replace("www.", "");
    if (!hasProtocol(req.body.url)) {
        req.body.url = "http://" + req.body.url;
    }

    return next();
}

/**
 * A middleware that checks for errors in the Request Body `url` field and adds it to Request.errors array
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
function validateUrl(req, res, next) {
    if (!req.body.url) {
        req.errors.push("You didn't send any url");
        return next();
    }

    try {
        let urlObject = new URL(req.body.url);
    } catch (err) {
        console.log(err);
        req.errors.push("Invalid URL was sent in the request");
    }

    return next();
}

export { validateUrl, formatUrl };

// <----- Helpers ----->
function hasProtocol(url) {
    const regex = new RegExp("^[a-zA-Z]+://");
    return regex.test(url);
}
