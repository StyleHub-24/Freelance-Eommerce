import userModel from "../models/userModel.js";

const migrateUserFields = async () => {
  try {
    const result = await userModel.updateMany(
      {
        $or: [
          { phoneNumber: { $exists: false } },
          { profilePicture: { $exists: false }},
          { gender: { $exists: false } },
          { address: { $exists: false } },
          { bio: { $exists: false } },
        ]
      },
      {
        $set: {
          phoneNumber: "",  
          profilePicture: "defaultImage",  
          gender: "other",  
          address: {},  
          bio: "",  
        }
      }
    );
    console.log(`✅ Migration completed. Updated ${result.modifiedCount} users.`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
};

export default migrateUserFields;
