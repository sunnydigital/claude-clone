import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: "" }),
    }),
    { name: "claude-auth" }
  )
);
