import express from 'express';
import { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, getUserProfile, updateUserProfile, sendPasswordChangeOtp, verifyOtpAndChangePassword } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/change-password/otp', authUser, sendPasswordChangeOtp);
userRouter.post('/change-password/verify', authUser, verifyOtpAndChangePassword);
// Route to get the user profile
userRouter.get('/profile', authUser, getUserProfile);  // New route for fetching the user profile
// Route to update user profile (Phone Number, Gender, Profile Picture)
userRouter.put('/update-profile', authUser, upload.single('profilePicture'), updateUserProfile);

export default userRouter;

