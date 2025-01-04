import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import { v2 as cloudinary } from 'cloudinary';
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists!" })
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        } else {
            return res.json({ success: false, message: "Invalid credentials!" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user registration
const registerUser = async (req, res) => {

    // res.json({msg: "Register API working"})
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists!" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email!" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password & atleast 8 characters!" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        // saving new user
        const user = await newUser.save();

        // creating token & sending response
        const token = createToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials!" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist!" });
        }

        // Create a reset token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send reset link via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, // use false for STARTTLS; true for SSL on port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, //app password
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password reset link sent to your email!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist!" });
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password & atleast 8 characters!" })
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successful!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to get user profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;  // Get the user ID from the auth middleware
        const user = await userModel.findById(userId); // Select relevant fields

        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }
        // console.log(user);

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to update user profile
const updateUserProfile = async (req, res) => {
    try {
      const { phoneNumber, gender, userId, name, email, bio, address } = req.body;
      const addressObject = JSON.parse(address); // Parse the stringified address object
  
      // First get current user 
      const currentUser = await userModel.findById(userId);
      if (!currentUser) {
        return res.json({ success: false, message: "User not found!" });
      }
  
      let profilePictureUrl = currentUser.profilePicture; // Keep existing profile picture by default
  
      // Only handle image upload if a new file is provided
      if (req.file) {
        // Delete old image from cloudinary if it exists and isn't the default
        if (currentUser.profilePicture && currentUser.profilePicture !== "default-image-url") {
          try {
            const parts = currentUser.profilePicture.split('/');
            const lastPart = parts[parts.length - 1];
            const publicId = lastPart.split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.log("Error deleting old image:", error);
          }
        }
  
        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
        profilePictureUrl = result.secure_url;
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            phoneNumber: phoneNumber || "",
            gender: gender || "other",
            profilePicture: profilePictureUrl, // Use either new uploaded image URL or keep existing one
            bio: bio || "",
            address: addressObject
          }
        },
        { new: true }
      );
  
      res.json({ success: true, message: "Profile updated successfully!", updatedUser });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };


export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, getUserProfile, updateUserProfile }