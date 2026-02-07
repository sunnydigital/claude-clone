"use client";

import { useState } from "react";
import { useUIStore, MODEL_OPTIONS } from "@/stores/uiStore";
import { useChatStore } from "@/stores/chatStore";
import { useChat } from "@/hooks/useChat";

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export default function HeaderBar() {
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const { selectedModel, setSelectedModel } = useUIStore();
  const activeChatId = useChatStore((s) => s.activeChatId);
  const { startNewChat } = useChat();

  const currentModel = MODEL_OPTIONS.find((m) => m.id === selectedModel);
  const modelDisplayName = currentModel?.name || "Claude";

  return (
    <header className="flex items-center justify-between px-3 h-[48px] flex-shrink-0">
      {/* Left: Model selector */}
      <div className="relative">
        <button
          onClick={() => setModelMenuOpen(!modelMenuOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-text-primary hover:bg-bg-hover transition-colors"
        >
          <span>{modelDisplayName}</span>
          <ChevronDownIcon />
        </button>

        {modelMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setModelMenuOpen(false)}
            />
            <div className="absolute top-full left-0 mt-1 bg-bg-modal border border-border-primary rounded-xl shadow-xl py-1.5 z-20 min-w-[240px]">
              <div className="px-3 py-1.5 text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                Model
              </div>
              {MODEL_OPTIONS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setModelMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                    model.id === selectedModel
                      ? "text-text-primary bg-bg-hover"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                  }`}
                >
                  <span>{model.name}</span>
                  {model.id === selectedModel && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right: New chat button */}
      <div className="flex items-center gap-1">
        <button
          onClick={startNewChat}
          className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="New chat"
        >
          <NewChatIcon />
        </button>
      </div>
    </header>
  );
}
