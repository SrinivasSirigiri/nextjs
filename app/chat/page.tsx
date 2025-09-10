"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Hi! Ask anything" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

//   async function getBotReply(userText: string): Promise<string> {
//     const lower = userText.toLowerCase();

//     if (lower.includes("news")) {
//         try {
//           const res = await fetch("/api/chat");
//           if (!res.ok) throw new Error("News API failed");
//           const data = await res.json();
      
//           const headlines = data?.data
//             ?.slice(0, 5)
//             .map((n: any) => `- ${n.title}`)
//             .join("\n");
      
//           return headlines || "No news found right now.";
//         } catch {
//           return "Sorry, I couldn't fetch the news at the moment.";
//         }
//       }
      

//     if (lower.includes("hello") || lower.includes("hi")) {
//       return "Hello 👋 How can I help you today?";
//     }
//     if (lower.includes("next js")) {
//       return "Next.js is a React framework for building fast, scalable web apps.";
//     }
//     if (lower.includes("tailwind")) {
//       return "Tailwind CSS is a utility-first CSS framework for styling your app quickly.";
//     }

//     return "I’m just a demo bot 🤖. Try asking me about Next.js, Tailwind CSS, or type 'news'.";
//   }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
  
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      let botReply = "";
  
      const res = await fetch(`/api/chat?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();

        if (data.headlines && data.headlines.length > 0) {
        // botReply = data.headlines
        //     .map((h: any, i: number) => `${i + 1}. ${h.title} (${h.url})`)
        //     .join("\n\n");
        botReply = data.headlines
        .map(
            (h: any, i: number) =>
            `<p>${i + 1}. <span>${h.title}</span> <p><a href="${h.url}" target="_blank" class="text-blue-500 underline">${h.url}</a></p></p>`
        )
        .join("");

        } else {
        botReply = `No news found for "${trimmed}".`;
        }

  
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botReply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong while fetching news.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }
  

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] w-full flex-col px-4 py-6">
      <h1 className="mb-4 text-center text-2xl font-semibold">News Chatbot</h1>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-xl border">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm " +
                  (m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900")
                }
              >
                {/* {m.content} */}
                <div dangerouslySetInnerHTML={{ __html: m.content }} />
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Type a keyword ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              disabled={isLoading || !input.trim()}
              onClick={handleSend}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
