import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'
import studentRoutes from './routes/student.route.js';

dotenv.config();

const app = express();

app.use(express.json()); // allows JSON data in body

app.use('/api/students', studentRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDB();
    console.log("Server started...")
})
