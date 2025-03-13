import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    month: {
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

const Exam = mongoose.model("Exam", examSchema)

export default Exam;