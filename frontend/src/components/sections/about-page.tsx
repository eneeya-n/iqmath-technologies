import { AnimatedStats } from "@/components/sections/animated-counter";
import {
  AboutCareers,
  AboutEnterpriseDev,
  AboutIntro,
  AboutRecognition,
  AboutTimeline,
  AboutValues,
  SectionHeading
} from "@/components/sections/about-sections";
import { ContactCta } from "@/components/shared/contact-cta";

export function AboutPageContent() {
  return (
    <main>
      <AboutIntro />
      <AboutRecognition />
      <AboutValues />
      <section className="mx-auto max-w-7xl px-6 py-6">
        <SectionHeading
          eyebrow="Traction & milestones"
          title="A short history of IQMath's growth, impact, and product vision"
        />
      </section>
      <AnimatedStats />
      <AboutTimeline />
      <AboutEnterpriseDev />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <ContactCta
          title="Ready to build with IQMath?"
          description="Reach out to discuss website and app development, EdTech products, or training programs."
        />
      </section>
      <AboutCareers />
    </main>
  );
}
