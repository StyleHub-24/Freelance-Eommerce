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

        // Simplified HTML email template
        const htmlTemplate = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
            <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="text-align: center; padding: 20px; background-color: #4a90e2; color: white; border-radius: 5px;">
                        <h1 style="margin: 0;">Password Reset Request</h1>
                    </div>
                    
                    <div style="padding: 20px; color: #333333;">
                        <p>Hello ${user.name},</p>
                        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                        <p>To reset your password, please click the link below:</p>
                        
                        <!-- Simple text link instead of a button -->
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" 
                               style="background-color: #4a90e2; 
                                      color: #ffffff; 
                                      text-decoration: none; 
                                      padding: 12px 30px; 
                                      border-radius: 5px; 
                                      font-weight: bold; 
                                      display: inline-block;">
                                Reset Your Password
                            </a>
                        </p>

                        <p style="font-size: 14px; color: #666666;">If the link doesn't work, copy and paste this URL into your browser:</p>
                        <p style="font-size: 14px; word-break: break-all; color: #4a90e2;">${resetLink}</p>
                        
                        <p style="font-size: 14px; color: #666666; margin-top: 30px;">This link will expire in 1 hour for security reasons.</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; color: #666666; font-size: 12px;">
                        <p>This is an automated email from [StyleHub]. Please do not reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} StyleHub.com All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'StyleHub',  
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Reset Your Password',  
            html: htmlTemplate,
            text: `Hello ${user.name},\n\nWe received a request to reset your password. To reset your password, click the following link: ${resetLink}\n\nIf you didn't make this request, you can safely ignore this email.\n\nThis link will expire in 1 hour for security reasons.`,
            headers: {
                'X-Priority': '1',  // High priority
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            }
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
            if (currentUser.profilePicture && currentUser.profilePicture !== "defaultImage") {
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