import {create} from "zustand";

export const useStudentStore = create((set) => ({
    students: [],
    setStudents: (students) => set({ students }),

    createStudent: async (newStudent) => {
        if (!newStudent.name || !newStudent.class || !newStudent.homeworkLog || !newStudent.examLog || !newStudent.comments) {
            return {success: false, message: "Please fill in all fields."}
        }
        const res = await fetch("/api/students", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newStudent)
        })
        const data = await res.json();
        set((state) => ({students: [...state.students, data.data]}));
        return {success: true, message: "Student created successfully"}
    },

    fetchStudents: async () => {
        const res = await fetch("/api/students");
        const data = await res.json();
        set({students: data.data});
    },

    deleteStudent: async (id) => {
        const res = await fetch(`/api/students/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set((state) => ({students: state.students.filter(student => student._id !== id)}));
        return {success: true, message: data.message};
    },

    updateStudent: async (id, updatedStudent) => {
        const res = await fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedStudent),
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set(state => ({
            students: state.students.map(student => student._id === id ? data.data : student)
        }));
        return {success: true, message: data.message};
    },

}))