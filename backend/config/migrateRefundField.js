import userModel from "../models/userModel.js";

const migrateUserFields = async () => {
  try {
    // Fetch all users with missing fields or fields that need recalculation
    const users = await userModel.find({
      $or: [
        { dateOfBirth: { $exists: false } },
        { age: { $exists: false } }, // Check if age is missing
      ],
    });

    const updates = users.map(async (user) => {
      // Calculate age if dateOfBirth exists
      const updatedAge = user.dateOfBirth ? user.calculateAge() : null;

      return userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            dateOfBirth: user.dateOfBirth || null,
            age: updatedAge, // Set calculated age or null
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
