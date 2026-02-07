"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { useChat } from "@/hooks/useChat";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

export default function ChatInput() {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming, stopStreaming } = useChat();
  const { setApiKeyModalOpen } = useUIStore();
  const apiKey = useAuthStore((s) => s.apiKey);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;
    if (!apiKey) {
      setApiKeyModalOpen(true);
      return;
    }
    sendMessage(text);
    setText("");
    textareaRef.current?.focus();
  }, [text, apiKey, sendMessage, setApiKeyModalOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 bg-bg-primary">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-[20px] border border-border-input bg-bg-input focus-within:border-border-input-focus focus-within:bg-bg-input-focus transition-colors shadow-sm">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Claude..."
            className="auto-resize-textarea w-full bg-transparent text-text-primary placeholder:text-text-placeholder resize-none px-4 pt-3.5 pb-12 text-[15px] focus:outline-none leading-relaxed"
            rows={1}
            disabled={isStreaming}
          />

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2.5">
            {/* Left: attachment button */}
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
                title="Attach file"
              >
                <PaperclipIcon />
              </button>
            </div>

            {/* Right: Send / Stop button */}
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="p-2 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                title="Stop generating"
              >
                <StopIcon />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="p-2 rounded-full bg-bg-accent text-text-on-accent hover:bg-bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <SendIcon />
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-text-tertiary text-center mt-2">
          Claude can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
