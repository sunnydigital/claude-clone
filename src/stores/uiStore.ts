import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  apiKeyModalOpen: boolean;
  profileMenuOpen: boolean;
  selectedModel: string;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setApiKeyModalOpen: (open: boolean) => void;
  setProfileMenuOpen: (open: boolean) => void;
  setSelectedModel: (model: string) => void;
}

export const MODEL_OPTIONS = [
  { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5", badge: null },
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", badge: null },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", badge: null },
] as const;

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      apiKeyModalOpen: false,
      profileMenuOpen: false,
      selectedModel: "claude-sonnet-4-5-20250929",

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setApiKeyModalOpen: (open) => set({ apiKeyModalOpen: open }),
      setProfileMenuOpen: (open) => set({ profileMenuOpen: open }),
      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: "claude-ui",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
