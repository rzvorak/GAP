import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    class: {
        type: Number,
        required: true
    },
    homeworkLog: {
        type: Map,
        required: true
    },
    examLog: {
        type: Map,
        required: true
    },
    comments: {
        type: Map,
        required: true
    },
    profile: {
        type: Map,
        required: true
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;