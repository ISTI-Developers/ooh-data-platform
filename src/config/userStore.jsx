import { create } from "zustand";

const useUser = create((set) => ({
  user: null,

  setUser: (userData) => {
    set({ user: userData });
    return { status: 200 };
  },

  clearUser: () => set({ user: null }),
}));
export default useUser;
