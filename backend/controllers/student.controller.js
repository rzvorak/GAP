import mongoose from 'mongoose';
import Student from '../models/student.model.js';

export const createStudent = async (req, res) => {
    const student = req.body;

    if (!student.name || !student.class || !student.homeworkLog || !student.examLog || !student.comments || !student.profile) {
        return res.status(400).json({success:false, message: "Please provide all fields"});
    }

    const newStudent = new Student(student);

    try {
        await newStudent.save();
        res.status(201).json({success: true, data: newStudent});
    } catch (error) {
        console.error("Error in Create Student: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({success: true, data: students});
    } catch (error) {
        console.log("Error in fetching students: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const updateStudent = async (req, res) => {
    const {id} = req.params;

    const student = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, student, {new:true});
        res.status(200).json({ success: true, data: updatedStudent});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
}

export const deleteStudent = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        await Student.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Student deleted"})
    } catch (error) {
        console.log("Error in fetching students:", error.mesage);
        res.status(404).json({success: false, message: "Student not found"});
    }
}