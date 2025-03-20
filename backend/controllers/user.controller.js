import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res) => {
    const {username, password, role, studentId} = req.body;

    if (!username || !password || !role || !studentId) {
        return res.status(400).json({success:false, message: "Please provide all fields"});
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({username, password: hashedPassword, role, studentId});

    try {
        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    } catch (error) {
        console.error("Error in Create User: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, role: user.role, studentId: user.studentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({success: true, data: users});
    } catch (error) {
        console.log("Error in fetching users: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;

    const {username, password, role, studentId} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10)

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {username, password: hashedPassword, role, studentId}, {new:true});
        res.status(200).json({ success: true, data: updatedUser});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted"})
    } catch (error) {
        console.log("Error in fetching users:", error.mesage);
        res.status(404).json({success: false, message: "User not found"});
    }
}