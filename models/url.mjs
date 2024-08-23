// imports
import mongoose from "mongoose";

// schema
const urlSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            unique: true,
        },

        shortCode: {
            type: String,
            unique: true,
        },

        accessCount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const urlModel = mongoose.model("Url", urlSchema);
export { urlModel };
