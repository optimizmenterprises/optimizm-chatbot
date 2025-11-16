"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  apiUrl: string;
  title?: string;
  brandColor?: string;
  welcomeMessage?: string;
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const OptimizmChatbot: React.FC<Props> = ({
  apiUrl,
  title = "Optimizm AI",
  brandColor = "#00E5D8",
  welcomeMessage = "Hey! I'm Optimizm AI — ask me anything about automation, small business systems, or AI workflows.",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid(), role: "assistant", content: welcomeMessage },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .concat(newMsg)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      let text = "";

      // If streaming isn’t set up, fallback to plain text
      try {
        text = await res.text();
      } catch {
        text = "Sorry, something went wrong.";
      }

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: text },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: "Something went wrong — try again.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div
      className="rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-xl p-4 w-full"
      style={{
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-neutral-800 pb-3">
        <div
          className="h-8 w-8 rounded-xl"
          style={{ backgroundColor: brandColor }}
        />
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-neutral-400">Powered by Optimizm Enterprises</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="space-y-3 max-h-[400px] overflow-y-auto pr-1 mb-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm border ${
                m.role === "user"
                  ? "bg-[color:var(--brand)] text-black"
                  : "bg-neutral-900 text-neutral-200 border-neutral-700"
              }`}
              style={{
                "--brand": brandColor,
              } as any}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-xs text-neutral-500 animate-pulse">
            Optimizm AI is thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            outlineColor: brandColor,
          }}
          placeholder="Ask Optimizm AI anything..."
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 border"
          style={{
            backgroundColor: brandColor,
            color: "#000",
          }}
        >
          Send
        </button>
      </div>

      <p className="text-[11px] text-neutral-500 mt-2">
        AI may produce inaccurate information. Verify important answers.
      </p>
    </div>
  );
};

export default OptimizmChatbot;
