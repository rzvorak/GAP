import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    class: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
    },
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;