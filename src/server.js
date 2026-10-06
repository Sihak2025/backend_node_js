/** @format */

import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import { router } from './routes/apiRoutes.js';
import cookieParser from 'cookie-parser';

config();
connectDB();

const app = express();
app.use(cookieParser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Route in server
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running.. ${PORT}`);
});

// close connection from prisma to database
process.on('SIGINT', async () => {
  await disconnectDB();
  console.log('Disconnected from database. Server stopped.');
  process.exit(0);
});

//http://localhost:3000
