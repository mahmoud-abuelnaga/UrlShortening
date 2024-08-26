// imports
import mongoose from "mongoose";

// schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
    },
});

const userModel = mongoose.model("User", userSchema);
export { userModel };
