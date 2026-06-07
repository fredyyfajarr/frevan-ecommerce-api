import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import authRouter from './routes/authRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import cartRouter from './routes/cartRouter.js';

// Middleware
app.use(
  cors({
    origin: [
      'https://frevan.vercel.app',
      'https://frevan-ecommerce-web.vercel.app',
      'https://isaacshop.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Parent Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/cart', cartRouter);

app.use(notFound);
app.use(errorHandler);

// Database
mongoose
  .connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 5000, // 5 seconds
    socketTimeoutMS: 45000, // 45 seconds
  })
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.error('Database Connection Error:', error);
  });

// Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
