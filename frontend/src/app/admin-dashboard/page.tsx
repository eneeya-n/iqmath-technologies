import { AdminAnalytics } from "@/components/sections/admin-analytics";
import { PageShell } from "@/components/shared/page-shell";

export default function AdminDashboardPage() {
  return (
    <main>
      <PageShell
        title="Admin SaaS Dashboard"
        subtitle="Stripe-inspired analytics with product usage, engagement intelligence, and activity tracking."
        bullets={[
          "Total Students and Active Courses",
          "Country and Product Usage",
          "Training Program Performance",
          "Recent Activities and Alerts"
        ]}
      />
      <AdminAnalytics />
    </main>
  );
}
