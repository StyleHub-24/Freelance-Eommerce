import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import migrateRefundField from "./config/migrateRefundField.js";
import reviewRouter from "./routes/ReviewRoute.js";
import {updateRouter} from "./routes/updateRoute.js"
import { chatbotRouter } from "./routes/chatbotRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
// To add new field in existing documents
// migrateRefundField();

// Middlewares
app.use(express.json())
app.use(cors())

// Api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter);
app.use('/api/productUpdate', updateRouter); 
app.use('/api/chatbot', chatbotRouter); 

app.get('/', (req, res) => {
    res.send('API WORKING');
})

// Listen
app.listen(port, () => console.log('😎 Server started on PORT : ' + port))