import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    phoneNumber: { type: String, default: "" },
    address: { type: Object, default: {} },
    profilePicture: { type: String, default: "defaultImage" },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    bio: { type: String, default: "" },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;