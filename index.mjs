// imports
import express from "express";
import mongoose from "mongoose";
import { shortenRouter } from "./routes/shorten.mjs";
import { authRouter } from "./routes/auth.mjs";
import crypto from "crypto";
import dotenv from "dotenv";

// add environment variables
dotenv.config();

// constants
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test";

// app config
const app = express();
app.use(express.json()); // parse incoming json requests
app.use((req, res, next) => {
    req.errors = [];
    next();
});

// routes
app.use("/shorten", shortenRouter);
app.use("/auth", authRouter);

// start server
main();
/**
 * Main function to start the server
 */
async function main() {
    placeSecretInEnv();
    try {
        await mongoose.connect(MONGODB_URI);
    } catch (err) {
        console.log(
            "Error connecting to the database...\nTerminating the sever..",
        );
        return;
    }

    app.listen(PORT, () => {
        console.log(`Server is running on: localhost:${PORT}`);
    });
}

// <------- helpers ------->
/**
 * Generate a secret token of 64 characters
 * @returns {string} A random string of 64 characters
 */
function generateTokenSecret() {
    return crypto.randomBytes(64).toString("hex");
}

/**
 * Place the secret token in the environment variables
 */
function placeSecretInEnv() {
    process.env.TOKEN_SECRET = generateTokenSecret();
}
