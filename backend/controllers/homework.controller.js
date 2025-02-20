import mongoose from 'mongoose';
import Homework from '../models/homework.model.js';

export const createHomework = async (req, res) => {
    const homework = req.body;

    if (!homework.name || !homework.points || !homework.subject || !homework.class || !homework.meanGrade) {
        return res.status(400).json({success:false, message: "Please provide all fields"});
    }

    const newHomework = new Homework(homework);

    try {
        await newHomework.save();
        res.status(201).json({success: true, data: newHomework});
    } catch (error) {
        console.error("Error in Create Homework: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const getHomeworks = async (req, res) => {
    try {
        const homeworks = await Homework.find({});
        res.status(200).json({success: true, data: homeworks});
    } catch (error) {
        console.log("Error in fetching homeworks: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const updateHomework = async (req, res) => {
    const {id} = req.params;

    const homework = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        const updatedHomework = await Homework.findByIdAndUpdate(id, homework, {new:true});
        res.status(200).json({ success: true, data: updatedHomework});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
}

export const deleteHomework = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        await Homework.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Homework deleted"})
    } catch (error) {
        console.log("Error in fetching homeworks:", error.mesage);
        res.status(404).json({success: false, message: "Homework not found"});
    }
}