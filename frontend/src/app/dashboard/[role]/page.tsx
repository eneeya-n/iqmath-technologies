import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/page-shell";

const roleContent: Record<string, { title: string; bullets: string[] }> = {
  admin: {
    title: "Admin Dashboard",
    bullets: ["Full analytics", "User and role management", "Revenue monitoring", "System settings"]
  },
  student: {
    title: "Student Dashboard",
    bullets: ["My learning plan", "Assessments", "Progress analytics", "AI support"]
  },
  mentor: {
    title: "Mentor Dashboard",
    bullets: ["Mentor sessions", "Student cohorts", "Review queue", "Performance metrics"]
  },
  corporate: {
    title: "Corporate Client Dashboard",
    bullets: ["Team progress", "Program reports", "Certification tracking", "ROI analytics"]
  },
  college: {
    title: "College Admin Dashboard",
    bullets: ["Department overview", "Student outcomes", "Faculty insights", "Placement readiness"]
  }
};

export function generateStaticParams() {
  return Object.keys(roleContent).map((role) => ({ role }));
}

export default function RoleDashboardPage({ params }: { params: { role: string } }) {
  const item = roleContent[params.role];
  if (!item) return notFound();
  return (
    <PageShell
      title={item.title}
      subtitle="Role-based access control experience for enterprise account types."
      bullets={item.bullets}
    />
  );
}
