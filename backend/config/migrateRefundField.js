import orderModel from "../models/orderModel.js"; 

const migrateRefundField = async () => {
  try {
    const result = await orderModel.updateMany(
      { refunded: { $exists: false } }, 
      { $set: { refunded: false } }
    );
    console.log(`✅ Migration completed. Updated ${result.modifiedCount} orders.`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
};

export default migrateRefundField;
