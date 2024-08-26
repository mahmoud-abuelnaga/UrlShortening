import express from "express";
import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/user.mjs";
import bcrypt from "bcrypt";

/**
 * Signs up the user
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
async function signup(req, res, next) {
    if (req.errors.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid Signup Request",
            errors: req.errors,
        });
    }

    let userExists;
    try {
        userExists = await checkEmailExists(req.body.email);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Database Error",
            errors: ["Error while accessing the database"],
        });
    }

    if (userExists) {
        return res.status(StatusCodes.CONFLICT).json({
            message: "User already exists",
            errors: ["Email already exists."],
        });
    }

    req.body.password = await hashPassword(req.body.password);
    let newUser;
    try {
        newUser = await userModel.create(req.body);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Database Error",
            errors: ["Error while creating the user"],
        });
    }

    return res.status(StatusCodes.CREATED).json({
        message: "User Created Successfully",
        email: newUser.email,
    });
}

/**
 * Handles login of the user
 *
 * @param {express.Request} req - Express Request Object
 * @param {express.Response} res - Express Response Object
 * @param {express.NextFunction} next - Express NextFunction
 */
function login(req, res, next) {}

export { signup, login };

// <------ Helpers ------>
/**
 * Checks if the email already exists in the database
 * @param {String} email - Email of the user
 */
async function checkEmailExists(email) {
    const existingUser = await userModel.findOne({ email });
    return Boolean(existingUser);
}

/**
 * Hashes the password using bcrypt
 * @param {String} password
 */
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
