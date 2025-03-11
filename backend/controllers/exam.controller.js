import mongoose from 'mongoose';
import Exam from '../models/exam.model.js';

export const createExam = async (req, res) => {
    const exam = req.body;

    if (!exam.type || !exam.points || !exam.month || !exam.class || !exam.meanGrade) {
        return res.status(400).json({success:false, message: "Please provide all fields"});
    }

    const newExam = new Exam(exam);

    try {
        await newExam.save();
        res.status(201).json({success: true, data: newExam});
    } catch (error) {
        console.error("Error in Create Exam: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find({});
        res.status(200).json({success: true, data: exams});
    } catch (error) {
        console.log("Error in fetching exams: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const updateExam = async (req, res) => {
    const {id} = req.params;

    const exam = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        const updatedExam = await Exam.findByIdAndUpdate(id, exam, {new:true});
        res.status(200).json({ success: true, data: updatedExam});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
}

export const deleteExam = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        await Exam.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Exam deleted"})
    } catch (error) {
        console.log("Error in fetching exams:", error.mesage);
        res.status(404).json({success: false, message: "Exam not found"});
    }
}