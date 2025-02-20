import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    class: {
        type: Number,
        required: true
    },
    meanGrade: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Homework = mongoose.model("Homework", homeworkSchema)

export default Homework