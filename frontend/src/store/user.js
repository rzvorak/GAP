import { create } from "zustand";

export const useUserStore = create((set) => ({
    users: [],
    setusers: (users) => set({ users }),

    createUser: async (newUser) => {
        if (!newUser.username || !newUser.password || !newUser.role || newUser.requestingNewPassword === undefined || !newUser.identity) {
            return { success: false, message: "Please fill in all fields." }
        }
        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        const data = await res.json();
        set((state) => ({ users: [...state.users, data.data] }));
        return { success: true, message: "User created successfully" }
    },

    fetchUsers: async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        set({ users: data.data });
    },

    deleteUser: async (id) => {
        const res = await fetch(`/api/users/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({ users: state.users.filter(user => user._id !== id) }));
        return { success: true, message: data.message };
    },

    updateUser: async (id, updatePassword, updatedUser,) => {

        console.log('in store: ', id, updatePassword)

        const res = await fetch(`/api/users/${updatePassword ? "password/" : ""}${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set(state => ({
            users: state.users.map(user => user._id === id ? data.data : user)
        }));
        return { success: true, message: data.message };
    },

}))