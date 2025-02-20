import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'
import studentRoutes from './routes/student.route.js';
import homeworkRoutes from './routes/homework.route.js';

dotenv.config();

const app = express();

app.use(express.json()); // allows JSON data in body

app.use('/api/students', studentRoutes)
app.use('/api/homework', homeworkRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDB();
    console.log("Server started...")
})
