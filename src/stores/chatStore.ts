import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isStreaming: boolean;

  createChat: (model?: string) => string;
  deleteChat: (id: string) => void;
  setActiveChatId: (id: string | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  getActiveChat: () => Chat | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      isStreaming: false,

      createChat: (model = "claude-sonnet-4-5-20250929") => {
        const id = crypto.randomUUID();
        const chat: Chat = {
          id,
          title: "New chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model,
        };
        set((state) => ({
          chats: [chat, ...state.chats],
          activeChatId: id,
        }));
        return id;
      },

      deleteChat: (id) =>
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== id),
          activeChatId: state.activeChatId === id ? null : state.activeChatId,
        })),

      setActiveChatId: (id) => set({ activeChatId: id }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
              : c
          ),
        })),

      updateMessage: (chatId, messageId, content) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m
                  ),
                  updatedAt: Date.now(),
                }
              : c
          ),
        })),

      updateChatTitle: (chatId, title) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId ? { ...c, title } : c
          ),
        })),

      setIsStreaming: (streaming) => set({ isStreaming: streaming }),

      getActiveChat: () => {
        const { chats, activeChatId } = get();
        return chats.find((c) => c.id === activeChatId);
      },
    }),
    {
      name: "claude-chats",
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
      }),
    }
  )
);
