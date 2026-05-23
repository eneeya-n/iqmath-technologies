import { DemoLabs } from "@/components/sections/demo-labs";

export default function LMSPlatformPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold text-white">LMS Platform</h1>
        <p className="mt-3 text-slate-300">
          Course builder, enrollments, quiz and assignment workflows, and progress analytics.
        </p>
      </section>
      <DemoLabs />
    </main>
  );
}
