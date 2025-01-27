import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date }, 
    age: { type: Number },
    cartData: { type: Object, default: {} },
    phoneNumber: { type: String, default: "" },
    address: { type: Object, default: {} },
    profilePicture: { type: String, default: "defaultImage" },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    bio: { type: String, default: "" },
}, {
    minimize: false,
    timestamps: true
})

// Calculate age utility function
userSchema.methods.calculateAge = function() {
    if (!this.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;