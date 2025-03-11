import {create} from "zustand";

export const useHomeworkStore = create((set) => ({
    homeworks: [],
    setHomeworks: (homeworks) => set({ homeworks }),

    createHomework: async (newHomework) => {
        if (!newHomework.name || !newHomework.points || !newHomework.subject || !newHomework.class || !newHomework.meanGrade) {
            return {success: false, message: "Please fill in all fields."}
        }
        const res = await fetch("/api/homework", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newHomework)
        })
        const data = await res.json();
        set((state) => ({homeworks: [...state.homeworks, data.data]}));
        return {success: true, message: "Homework created successfully"}
    },

    fetchHomeworks: async () => {
        const res = await fetch("/api/homework");
        const data = await res.json();
        set({homeworks: data.data});
    },

    deleteHomework: async (id) => {
        const res = await fetch(`/api/homework/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set((state) => ({homeworks: state.homeworks.filter(homework => homework._id !== id)}));
        return {success: true, message: data.message};
    },

    updateHomework: async (id, updatedHomework) => {
        const res = await fetch(`/api/homework/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedHomework),
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set(state => ({
            homeworks: state.homeworks.map(homework => homework._id === id ? data.data : homework)
        }));
        return {success: true, message: data.message};
    },

}))