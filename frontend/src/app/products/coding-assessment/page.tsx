import { DemoLabs } from "@/components/sections/demo-labs";

export default function CodingAssessmentPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold text-white">Coding Assessment Platform</h1>
        <p className="mt-3 text-slate-300">
          Multi-language coding editor, auto-grading, test case validation, and leaderboard.
        </p>
      </section>
      <DemoLabs />
    </main>
  );
}
