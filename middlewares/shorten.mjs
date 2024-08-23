// imports
import express from "express";
import { URL } from "url";

function validateUrl(req, res, next) {
    function hasProtocol(url) {
        const regex = new RegExp("^[a-zA-Z]+://");
        return regex.test(url);
    }

    if (!req.body.url) {
        req.errors = ["You didn't send any url"];
        return next();
    }

    req.body.url = req.body.url.trim();
    if (!hasProtocol(req.body.url)) {
        req.body.url = "http://" + req.body.url;
    }

    try {
        let urlObject = new URL(req.body.url);
    } catch (err) {
        console.log(err);
        req.errors = ["Invalid URL was sent in the request"];
    }

    return next();
}

export { validateUrl };
