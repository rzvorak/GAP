import {create} from "zustand";

export const useUserStore = create((set) => ({
    users: [],
    setusers: (users) => set({ users }),

    createUser: async (newUser) => {
        if (!newUser.username || !newUser.password || !newUser.role) {
            return {success: false, message: "Please fill in all fields."}
        }
        const res = await fetch("/api/users", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newUser)
        })
        const data = await res.json();
        set((state) => ({users: [...state.users, data.data]}));
        return {success: true, message: "User created successfully"}
    },

    fetchUsers: async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        set({users: data.data});
    },

    deleteUser: async (id) => {
        const res = await fetch(`/api/users/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set((state) => ({users: state.users.filter(student => student._id !== id)}));
        return {success: true, message: data.message};
    },

    updateUser: async (id, updatedUser) => {
        const res = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};

        set(state => ({
            users: state.users.map(student => student._id === id ? data.data : student)
        }));
        return {success: true, message: data.message};
    },

}))