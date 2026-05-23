import { DemoLabs } from "@/components/sections/demo-labs";

export default function AITocGeneratorPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold text-white">AI ToC Generator</h1>
        <p className="mt-3 text-slate-300">
          Upload syllabus PDFs, extract topics, auto-generate table of contents, and export.
        </p>
      </section>
      <DemoLabs />
    </main>
  );
}
