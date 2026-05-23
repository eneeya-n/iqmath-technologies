import { AIAgentChat } from "@/components/sections/ai-agent-chat";
import { PageShell } from "@/components/shared/page-shell";

export default function StudentPortalPage() {
  return (
    <main>
      <PageShell
        title="Student Portal"
        subtitle="Personalized learning dashboard with assignments, quizzes, and AI student support."
        bullets={[
          "My Courses and Progress",
          "Assignments and Deadlines",
          "Coding Assessments",
          "AI Study Assistant"
        ]}
      />
      <AIAgentChat />
    </main>
  );
}
