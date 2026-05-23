import { PageShell } from "@/components/shared/page-shell";

export default function CorporateTrainingPage() {
  return (
    <PageShell
      title="Corporate Training"
      subtitle="Enterprise-focused programs that improve digital productivity, coding standards, and AI adoption."
      bullets={[
        "Role-based learning paths",
        "Assessment-led certification",
        "Manager dashboards and analytics",
        "Hybrid (online + onsite) delivery"
      ]}
    />
  );
}
