import express from "express";
import validator from "validator";

/**
 * A middleware that checks for errors in the Request Body `email` field and adds it to Request.errors array
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
function validateEmail(req, res, next) {
    if (!req.body.email) {
        req.errors.push("Email field is required in the request");
        return next();
    }

    if (!validator.isEmail(req.body.email)) {
        req.errors.push("Invalid email was sent in the request");
    }

    return next();
}

/**
 * A middleware that checks for errors in the Request Body `password` field and adds it to Request.errors array
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
function validatePassword(req, res, next) {
    if (!req.body.password) {
        req.errors.push("Password field is required in the request");
        return next();
    }

    if (req.body.password.length < 6) {
        req.errors.push("Password must be at least 6 characters long");
    }

    return next();
}

const validateSignup = [validateEmail, validatePassword];
export { validateSignup };
