"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import hljs from "highlight.js";

interface CodeBlockProps {
  language?: string;
  code: string;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && language) {
      codeRef.current.removeAttribute("data-highlighted");
      try {
        hljs.highlightElement(codeRef.current);
      } catch {
        // language not supported, leave as plain text
      }
    }
  }, [code, language]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#333] my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#333]">
        <span className="text-xs text-[#888] font-mono">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#ccc] transition-colors"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed !bg-[#1a1a1a]">
        <code
          ref={codeRef}
          className={`font-mono !bg-transparent ${language ? `language-${language}` : ""}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
