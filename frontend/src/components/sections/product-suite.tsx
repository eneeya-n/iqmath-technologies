import { Card } from "@/components/ui/card";

const products = [
  {
    title: "Ticketing Sites",
    points: [
      "Event discovery and seat selection",
      "Secure checkout and QR entry",
      "Admin dashboards for organizers"
    ]
  },
  {
    title: "LMS for Schools, Colleges & Institutions",
    points: [
      "Course and curriculum management",
      "Assessments, quizzes, and certificates",
      "Student progress and analytics"
    ]
  },
  {
    title: "Booking Platforms",
    points: [
      "Appointment and slot scheduling",
      "Payments, reminders, and confirmations",
      "Multi-location and staff management"
    ]
  },
  {
    title: "AI-Powered Bots",
    points: [
      "Website and WhatsApp chat assistants",
      "Lead capture and support automation",
      "Knowledge-base and FAQ handling"
    ]
  },
  {
    title: "AI Solutions",
    points: [
      "Custom AI workflows and integrations",
      "Document intelligence and automation",
      "Analytics, dashboards, and copilots"
    ]
  }
];

export function ProductSuite() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-3xl font-semibold text-white">Solutions We Build & Deploy</h2>
      <p className="mt-2 max-w-3xl text-slate-300">
        From ticketing and booking platforms to institution-grade LMS, AI bots, and custom AI
        solutions — production-ready systems for schools, colleges, corporates, and global brands.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <Card key={item.title} className="group transition hover:border-cyan-300/45">
            <h3 className="text-xl font-semibold text-cyan-200">{item.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {item.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
