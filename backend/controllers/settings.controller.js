import mongoose from 'mongoose'
import Settings from '../models/settings.model.js'

export const createSettings = async (req, res) => {
    const settings = req.body;

    if (!settings.distribution || !settings.cutoffs) {
        return res.status(400).json({success:false, message: "Please provide all fields"})
    }

    const newSettings = Settings(settings);

    try {
        await newSettings.save()
        return res.status(201).json({success: true, data: newSettings})
    } catch (error) {
        console.error("Error in Create Settings: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const updateSettings = async (req, res) => {
    const settings = req.body

    try {
        const updatedSettings = await Settings.findByIdAndUpdate("global", settings, {new:true});
        res.status(200).json({ success: true, data: updatedSettings});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
}

export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne({_id: "global"});
        res.status(200).json({success: true, data: settings});
    } catch (error) {
        console.log("Error in fetching settings: " + error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}