"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
