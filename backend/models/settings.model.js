import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
    _id: { type: String, default: "global" },
    distribution: {
        type: Map,
        required: true,
        default: { "Homework": 10, "Monthly": 20, "Midterm": 20, "Terminal": 50 }
    },
    cutoffs: {
        type: Map,
        required: true,
        default: {"A": 81, "B": 61, "C": 41, "D": 21, "F": 0}
    },
    subjects: {
        type: Map,
        required: true,
    }

}, {timestamps: true, _id: false})

const Settings = mongoose.model("Settings", settingsSchema)

export default Settings