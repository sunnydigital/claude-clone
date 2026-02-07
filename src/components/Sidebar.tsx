"use client";

import { useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useUIStore } from "@/stores/uiStore";
import { useChat } from "@/hooks/useChat";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SidebarToggleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const day = 86400000;

  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return "Previous 7 Days";
  if (diff < 30 * day) return "Previous 30 Days";
  return new Date(timestamp).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Sidebar() {
  const { chats, activeChatId, setActiveChatId, deleteChat } = useChatStore();
  const { sidebarOpen, toggleSidebar, setApiKeyModalOpen } = useUIStore();
  const { startNewChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = searchQuery
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  // Group chats by date
  const grouped = filteredChats.reduce<Record<string, typeof chats>>((acc, chat) => {
    const label = formatDate(chat.updatedAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(chat);
    return acc;
  }, {});

  if (!sidebarOpen) {
    return (
      <div className="flex flex-col items-center py-3 px-1 gap-1 h-full bg-bg-sidebar border-r border-border-secondary">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Open sidebar"
        >
          <SidebarToggleIcon />
        </button>
        <button
          onClick={startNewChat}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="New chat"
        >
          <PlusIcon />
        </button>
        <button
          onClick={() => { toggleSidebar(); }}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Search"
        >
          <SearchIcon />
        </button>
        <button
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Starred"
        >
          <StarIcon />
        </button>
        <button
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Projects"
        >
          <FolderIcon />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setApiKeyModalOpen(true)}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-[260px] bg-bg-sidebar border-r border-border-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="Close sidebar"
        >
          <SidebarToggleIcon />
        </button>
        <button
          onClick={startNewChat}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title="New chat"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary text-text-tertiary">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
        </div>
      </div>

      {/* Nav buttons */}
      <div className="px-2 pb-1">
        <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors">
          <StarIcon />
          <span>Starred</span>
        </button>
        <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors">
          <FolderIcon />
          <span>Projects</span>
        </button>
      </div>

      <div className="mx-3 border-b border-border-secondary mb-1" />

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {Object.entries(grouped).map(([label, groupChats]) => (
          <div key={label} className="mb-1">
            <div className="px-3 py-1.5 text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
              {label}
            </div>
            {groupChats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                  chat.id === activeChatId
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                }`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <span className="flex-1 truncate">{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-bg-secondary text-text-tertiary hover:text-text-primary transition-all flex-shrink-0"
                  title="Delete chat"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        ))}

        {chats.length === 0 && !searchQuery && (
          <div className="px-3 py-8 text-center text-text-tertiary text-sm">
            No conversations yet
          </div>
        )}

        {filteredChats.length === 0 && searchQuery && (
          <div className="px-3 py-8 text-center text-text-tertiary text-sm">
            No results found
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border-secondary p-2">
        <button
          onClick={() => setApiKeyModalOpen(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>
      </div>
    </div>
  );
}
