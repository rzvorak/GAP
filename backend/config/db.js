import mongoose from 'mongoose';
import { init } from './init.js'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        await init();
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error( `Error: ${error.message}`);
        process.exit(1) // 1 error, 0 success
    }
}