import express from "express";
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay, cancelOrder, updateRefundStatus, updateEstimatedDelivery } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/updateRefund', adminAuth, updateRefundStatus)
orderRouter.post('/updateEstimatedDelivery', adminAuth, updateEstimatedDelivery);

// Payement Features
orderRouter.post('/place', authUser, placeOrder) // COD
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// User Features -->
orderRouter.post('/userorders', authUser, userOrders)
// Cancel Order Route
orderRouter.post('/cancel', authUser, cancelOrder);


// Verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

export default orderRouter