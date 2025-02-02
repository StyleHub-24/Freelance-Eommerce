import userModel from "../models/userModel.js";

const migrateUserFields = async () => {
  try {
    // Fetch all users with missing fields or fields that need recalculation
    const users = await userModel.find({
      $or: [
        { otp: { $exists: false } },       // Check if otp is missing
        { otpExpiry: { $exists: false } }, // Check if otpExpiry is missing
      ],
    });

    const updates = users.map(async (user) => {
      return userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            otp: user.otp || null,          // Set otp to existing value or null
            otpExpiry: user.otpExpiry || null, // Set otpExpiry to existing value or null
          },
        }
      );
    });

    // Await all update operations
    const result = await Promise.all(updates);

    console.log(`✅ Migration completed. Updated ${result.length} users.`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
};

export default migrateUserFields;