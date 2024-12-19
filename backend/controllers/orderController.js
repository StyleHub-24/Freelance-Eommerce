import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe";
import razorpay from "razorpay";
// Global variables
const currency = "inr"
const deliveryCharge = 10

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
}) 

// Placing orders using COD Method
const placeOrder = async (req, res) => {

    try {
        
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // after placing order clear the cart data
        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order placed successfully!"})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        
        const { userId, items, amount, address } = req.body
        const { origin } = req.headers // to get the origin url

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success: true, session_url:session.url}) 


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Verify Stripe
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {
        
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true, message: "Order placed successfully & Payment successful!"})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success: false, message: "Order placed failed cause payment failed!"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({success: false, message: error.message})
            }
            res.json({success: true, order})
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Verify Razorpay
const verifyRazorpay = async (req, res) => {
    try {
        
        const { userId, razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo);
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true, message: "Order placed successfully & Payment successful!"})
        } else {
            res.json({success: false, message: "Order placed failed cause payment failed!"})
        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// All orders data for admin panel
const allOrders = async (req, res) => {
    
    try {
        
        const orders = await orderModel.find({})
        res.json({success: true, orders})


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// User Order data for Frontend
const userOrders = async (req, res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Update order status from Admin panel
const updateStatus = async (req, res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order status updated successfully!"})


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const cancelOrder = async (req, res) => {
    try {
      const { userId, orderId } = req.body;
    //   console.log("Cancel Request: userId:", userId, "orderId:", orderId);
  
      // Find the order by ID and ensure it belongs to the user
      const order = await orderModel.findOne({ _id: orderId, userId });
      console.log("Order Found:", order);
  
      if (!order) {
        return res.json({ success: false, message: "Order not found!" });
      }
  
      if (order.status !== "Order Placed") {
        return res.json({
          success: false,
          message: "Order cannot be canceled after processing!",
        });
      }
  
      // Cancel the order
      await orderModel.findByIdAndUpdate(orderId, {
        status: "Canceled",
        payment: false,
      });
  
      res.json({ success: true, message: "Order canceled successfully!" });
    } catch (error) {
      console.error("Order Cancel Error:", error);
      res.json({ success: false, message: error.message });
    }
  };
  
  

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay, cancelOrder }
