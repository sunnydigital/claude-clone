import { useRef, useCallback } from "react";
import { useChatStore, Message } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { streamChat } from "@/lib/api";

export function useChat() {
  const abortRef = useRef<AbortController | null>(null);

  const {
    chats,
    activeChatId,
    isStreaming,
    createChat,
    addMessage,
    updateMessage,
    updateChatTitle,
    setIsStreaming,
    setActiveChatId,
  } = useChatStore();

  const apiKey = useAuthStore((s) => s.apiKey);
  const selectedModel = useUIStore((s) => s.selectedModel);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      let chatId = activeChatId;
      if (!chatId) {
        chatId = createChat(selectedModel);
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };
      addMessage(chatId, userMessage);

      // Auto-title based on first user message
      const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
      if (chat && chat.messages.length <= 1) {
        const title = content.trim().slice(0, 50) + (content.trim().length > 50 ? "..." : "");
        updateChatTitle(chatId, title);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      addMessage(chatId, assistantMessage);

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      const allMessages = useChatStore
        .getState()
        .chats.find((c) => c.id === chatId)!
        .messages.filter((m) => m.id !== assistantMessage.id)
        .map((m) => ({ role: m.role, content: m.content }));

      await streamChat(
        allMessages,
        selectedModel,
        apiKey,
        {
          onToken: (token) => {
            const current = useChatStore
              .getState()
              .chats.find((c) => c.id === chatId)
              ?.messages.find((m) => m.id === assistantMessage.id);
            updateMessage(chatId!, assistantMessage.id, (current?.content || "") + token);
          },
          onComplete: () => {
            setIsStreaming(false);
            abortRef.current = null;
          },
          onError: (error) => {
            updateMessage(chatId!, assistantMessage.id, `Error: ${error}`);
            setIsStreaming(false);
            abortRef.current = null;
          },
        },
        controller.signal
      );
    },
    [
      activeChatId,
      isStreaming,
      apiKey,
      selectedModel,
      createChat,
      addMessage,
      updateMessage,
      updateChatTitle,
      setIsStreaming,
    ]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, [setIsStreaming]);

  const startNewChat = useCallback(() => {
    setActiveChatId(null);
  }, [setActiveChatId]);

  return {
    activeChat,
    isStreaming,
    sendMessage,
    stopStreaming,
    startNewChat,
  };
}
