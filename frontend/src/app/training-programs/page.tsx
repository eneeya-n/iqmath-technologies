import { PageShell } from "@/components/shared/page-shell";

export default function TrainingProgramsPage() {
  return (
    <PageShell
      title="Training Programs"
      subtitle="High-impact training tracks for students, corporates, and colleges in India and Malaysia."
      bullets={[
        "Student Training Bootcamps",
        "Corporate Upskilling Programs",
        "College Integrated Academic Tracks",
        "AI + Coding + Employability Modules"
      ]}
    />
  );
}
