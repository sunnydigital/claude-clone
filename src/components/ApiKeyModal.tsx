"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";

export default function ApiKeyModal() {
  const { apiKey, setApiKey } = useAuthStore();
  const { apiKeyModalOpen, setApiKeyModalOpen } = useUIStore();
  const [value, setValue] = useState(apiKey);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (apiKeyModalOpen) {
      setValue(apiKey);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [apiKeyModalOpen, apiKey]);

  if (!apiKeyModalOpen) return null;

  const handleSave = () => {
    setApiKey(value.trim());
    setApiKeyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-bg-modal-overlay"
        onClick={() => setApiKeyModalOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-bg-modal border border-border-primary rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-1">
          API Key
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Enter your Anthropic API key to start chatting. Your key is stored locally and never sent to our servers.
        </p>

        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="sk-ant-..."
          className="w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border-input text-text-primary placeholder:text-text-placeholder text-sm focus:outline-none focus:border-border-input-focus transition-colors"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!value.trim()}
            className="px-4 py-2 rounded-lg text-sm bg-bg-accent text-text-on-accent hover:bg-bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
