import { DemoLabs } from "@/components/sections/demo-labs";

export default function AIProctoredExamPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold text-white">AI Proctored Exam Platform</h1>
        <p className="mt-3 text-slate-300">
          Webcam monitoring, tab-switch detection, face checks, and suspicious behavior alerts.
        </p>
      </section>
      <DemoLabs />
    </main>
  );
}
