import { PageShell } from "@/components/shared/page-shell";

export default function MentorsPage() {
  return (
    <PageShell
      title="Mentors Network"
      subtitle="50+ expert mentors across AI, web development, data science, and placement readiness."
      bullets={[
        "Weekly live mentorship sessions",
        "Code and project reviews",
        "Interview preparation guidance",
        "Role-specific learning roadmaps"
      ]}
    />
  );
}
