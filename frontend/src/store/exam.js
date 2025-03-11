import {create} from "zustand";

export const useExamStore = create((set) => ({
    exams: [],
    setExams: (exams) => set({ exams }),

    createExam: async (newExam) => {
        if (!newExam.type || !newExam.points || !newExam.month || !newExam.class || !newExam.meanGrade) {
            return {success: false, message: "Please fill in all fields."}
        }
        const res = await fetch("/api/exams", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newExam)
        })
        const data = await res.json();
        set((state) => ({exams: [...state.exams, data.data]}));
        return {success: true, message: "Exam created successfully"}
    },

    fetchExams: async () => {
        const res = await fetch("/api/exams");
        const data = await res.json();
        set({exams: data.data});
    },

    deleteExam: async (id) => {
        const res = await fetch(`/api/exams/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set((state) => ({exams: state.exams.filter(exam => exam._id !== id)}));
        return {success: true, message: data.message};
    },

    updateExam: async (id, updatedExam) => {
        const res = await fetch(`/api/exams/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedExam),
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set(state => ({
            exams: state.exams.map(exam => exam._id === id ? data.data : exam)
        }));
        return {success: true, message: data.message};
    },

}))