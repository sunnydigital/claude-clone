"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { useChat } from "@/hooks/useChat";
import { useChatStore, Message } from "@/stores/chatStore";

function ClaudeLogo() {
  return (
    <div className="w-7 h-7 rounded-full bg-bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg width="14" height="14" viewBox="0 0 18 16" fill="var(--color-text-on-accent)">
        <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z" />
      </svg>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className="inline-flex gap-1 ml-0.5">
      <span className="streaming-dot w-1.5 h-1.5 bg-text-accent rounded-full inline-block" />
      <span className="streaming-dot w-1.5 h-1.5 bg-text-accent rounded-full inline-block" />
      <span className="streaming-dot w-1.5 h-1.5 bg-text-accent rounded-full inline-block" />
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
      title="Copy message"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
      title="Retry"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    </button>
  );
}

function MessageActions({ message, isLast, onRetry }: { message: Message; isLast: boolean; onRetry: () => void }) {
  if (message.role === "user") return null;

  return (
    <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton text={message.content} />
      {isLast && <RetryButton onClick={onRetry} />}
    </div>
  );
}

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-full bg-bg-accent/15 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 18 16" fill="var(--color-text-accent)">
            <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z" />
          </svg>
        </div>
        <h1 className="text-[22px] font-semibold text-text-primary mb-2 text-center">
          What can I help you with?
        </h1>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 max-w-lg justify-center">
        {[
          "Write a story",
          "Help me code",
          "Analyze data",
          "Brainstorm ideas",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 rounded-full border border-border-input text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:border-text-tertiary transition-colors cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatArea() {
  const { activeChat, isStreaming, sendMessage } = useChat();
  const messages = activeChat?.messages || [];
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeChatId = useChatStore((s) => s.activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  const handleRetry = useCallback(() => {
    if (messages.length < 2 || isStreaming) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content);
    }
  }, [messages, isStreaming, sendMessage]);

  const handleSuggestionClick = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  if (!activeChatId || messages.length === 0) {
    return <WelcomeScreen onSuggestionClick={handleSuggestionClick} />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {messages.map((message, index) => (
          <div key={message.id} className="mb-6 group">
            {message.role === "user" ? (
              /* User message - right-aligned bubble */
              <div className="flex justify-end">
                <div className="bg-bg-message-user rounded-2xl px-4 py-2.5 max-w-[85%]">
                  <p className="text-[15px] text-text-primary whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              /* Assistant message - left with avatar */
              <div className="flex gap-3">
                <ClaudeLogo />
                <div className="flex-1 min-w-0">
                  <div className="markdown-content text-[15px] text-text-primary">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({ children }) => <>{children}</>,
                        code: ({ className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeString = String(children).replace(/\n$/, "");
                          if (match) {
                            return <CodeBlock language={match[1]} code={codeString} />;
                          }
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {isStreaming &&
                      message.id === messages[messages.length - 1]?.id &&
                      message.content === "" && <StreamingDots />}
                  </div>
                  {!isStreaming && message.content && (
                    <MessageActions
                      message={message}
                      isLast={index === messages.length - 1}
                      onRetry={handleRetry}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
