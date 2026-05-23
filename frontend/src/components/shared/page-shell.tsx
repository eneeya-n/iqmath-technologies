import { Card } from "@/components/ui/card";

type PageShellProps = {
  title: string;
  subtitle: string;
  bullets: string[];
};

export function PageShell({ title, subtitle, bullets }: PageShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-300">{subtitle}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {bullets.map((item) => (
          <Card key={item} className="text-slate-200">
            {item}
          </Card>
        ))}
      </div>
    </main>
  );
}
