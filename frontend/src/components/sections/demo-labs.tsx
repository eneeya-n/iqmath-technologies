"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DemoLabs() {
  const [prompt, setPrompt] = useState("Generate ToC for Data Structures syllabus");
  const [aiResult, setAiResult] = useState("Unit 1: Arrays, Unit 2: Linked Lists, Unit 3: Trees...");

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-2">
      <Card>
        <h3 className="text-xl font-semibold text-cyan-200">AI ToC Generator - Live Demo</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-4 h-24 w-full rounded-lg border border-white/20 bg-slate-900/70 p-3 text-sm text-white outline-none"
        />
        <Button className="mt-4" onClick={() => setAiResult(`AI generated TOC for: ${prompt}`)}>
          Generate ToC
        </Button>
        <p className="mt-3 text-sm text-slate-300">{aiResult}</p>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-cyan-200">AI Exam Proctoring Simulation</h3>
        <div className="mt-4 rounded-xl border border-red-400/35 bg-red-500/10 p-4 text-sm text-red-200">
          Webcam: Active | Tab switches: 2 | Face mismatch: No
        </div>
        <div className="mt-4 rounded-xl border border-yellow-400/35 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          Alert: Suspicious behavior score - Medium
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-cyan-200">Coding Assessment Playground</h3>
        <pre className="mt-4 rounded-xl border border-white/20 bg-slate-900 p-3 text-xs text-green-300">
{`function solve(arr) {
  return arr.reduce((a, b) => a + b, 0);
}`}
        </pre>
        <p className="mt-3 text-sm text-slate-300">
          Test Cases: 12/12 passed | Language: JavaScript | Runtime Rank: Top 8%
        </p>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-cyan-200">LMS Drag-and-Drop Builder</h3>
        <div className="mt-4 grid gap-2">
          {["Intro to AI", "Quiz - Week 1", "Assignment - Capstone"].map((item) => (
            <div
              key={item}
              className="cursor-move rounded-lg border border-cyan-300/30 bg-cyan-500/10 p-3 text-sm text-cyan-100"
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
