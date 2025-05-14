import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface UserStore {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}


export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  user: null,
  setUser: (user: User | null) => set({ user }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));
