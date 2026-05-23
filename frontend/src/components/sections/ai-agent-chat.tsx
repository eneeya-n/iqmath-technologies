"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const agents = [
  "Student Support AI",
  "Course Recommendation AI",
  "Exam Monitoring AI",
  "Mentor Assistant AI"
];

export function AIAgentChat() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Hello! How can I help with your learning plan today?"
  ]);

  const onSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, `You: ${message}`, `${selectedAgent}: Working on it...`]);
    setMessage("");
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Card>
        <h2 className="text-2xl font-semibold text-cyan-200">AI Agents Workspace</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {agents.map((agent) => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                selectedAgent === agent
                  ? "border-cyan-300 bg-cyan-500/20 text-cyan-100"
                  : "border-white/20 bg-white/5 text-slate-300"
              }`}
            >
              {agent}
            </button>
          ))}
        </div>
        <div className="mt-4 h-56 overflow-auto rounded-xl border border-white/20 bg-slate-900/60 p-3 text-sm text-slate-200">
          {messages.map((item, idx) => (
            <p key={idx} className="mb-2">
              {item}
            </p>
          ))}
        </div>
        <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask an AI agent..."
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-white outline-none"
          />
          <Button onClick={onSend} className="w-full shrink-0 sm:w-auto">
            Send
          </Button>
        </div>
      </Card>
    </section>
  );
}
