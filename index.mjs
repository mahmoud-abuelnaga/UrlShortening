// imports
import express from "express";
import mongoose from "mongoose";
import { shortenRouter } from "./routes/shorten.mjs";
import dotenv from "dotenv";

// add environment variables
dotenv.config();

// constants
const PORT = process.env.PORT || 8080;
const MONGODB_URI = "mongodb://127.0.0.1:27017/test";

// app config
const app = express();
app.use(express.json()); // parse incoming json requests

// routes
app.use("/shorten", shortenRouter);

async function main() {
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
        console.log(`Server is running on: localhost:${PORT}`);
    });
}

main();
