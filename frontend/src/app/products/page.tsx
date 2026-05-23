import { ProductSuite } from "@/components/sections/product-suite";
import { DemoLabs } from "@/components/sections/demo-labs";

export default function ProductsPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold text-white">SaaS Product Portfolio</h1>
        <p className="mt-3 text-slate-300">
          AI ToC, Proctored Exams, Coding Assessments, and LMS workflows built for scale.
        </p>
      </section>
      <ProductSuite />
      <DemoLabs />
    </main>
  );
}
