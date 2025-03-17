import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'
import studentRoutes from './routes/student.route.js';
import homeworkRoutes from './routes/homework.route.js';
import settingsRoutes from './routes/settings.route.js';
import examRoutes from './routes/exam.route.js'
import Settings from './models/settings.model.js';

dotenv.config();

const app = express();

app.use(express.json()); // allows JSON data in body

app.use('/api/students', studentRoutes)
app.use('/api/homework', homeworkRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/exams', examRoutes)

const initializeSettings = async () => {
    try {
        const existingSettings = await Settings.findById("global");
        
        if (!existingSettings) {
            await Settings.create({
                _id: "global",
                distribution: { "homework": 10, "monthly": 20, "midterm": 20, "terminal": 50 },
                cuttoffs: {"A": 81, "B": 61, "C": 41, "D": 21, "F": 0}
            });
        }
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
};

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
    await connectDB();
    await initializeSettings();
    console.log("Server started...")
})
