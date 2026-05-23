import { PageShell } from "@/components/shared/page-shell";
import { CertificateGallery } from "@/components/sections/certificate-gallery";

export default function CertificatesPage() {
  return (
    <main>
      <PageShell
        title="Certificates Showcase"
        subtitle="Verified certificates from student cohorts, partnerships, and corporate enablement programs."
        bullets={[
          "Program completion certificates",
          "Corporate training certificates",
          "Mentor acknowledgment certificates",
          "Institutional collaboration credentials"
        ]}
      />
      <CertificateGallery />
    </main>
  );
}
