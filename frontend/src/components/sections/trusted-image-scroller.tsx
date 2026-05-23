import Image from "next/image";
import { Card } from "@/components/ui/card";

const trustedImages = [
  { src: "/assets/logos/logo-1.jpeg", alt: "College collaboration event" },
  { src: "/assets/logos/logo-2.jpeg", alt: "Enterprise workshop session" },
  { src: "/assets/logos/logo-3.jpeg", alt: "Campus training activity" },
  { src: "/assets/logos/logo-4.jpg", alt: "Institutional partnership program" },
  { src: "/assets/highlights/training.jpg", alt: "Training program highlights" },
  { src: "/assets/highlights/products-wow.jpg", alt: "Product showcase highlights" }
];

export function TrustedImageScroller() {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-6 py-12">
      <h2 className="text-2xl font-semibold text-white">Trusted by Colleges and Enterprises</h2>
      <p className="mt-2 text-slate-300">
        Live snapshots from partner campuses, training programs, and product showcases.
      </p>

      <div className="mt-6 flex w-max animate-[scroll_28s_linear_infinite] gap-4">
        {[...trustedImages, ...trustedImages].map((item, idx) => (
          <Card
            key={`${item.src}-${idx}`}
            className="min-w-[280px] overflow-hidden border-cyan-300/20 p-1 md:min-w-[360px]"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={420}
              height={260}
              className="h-44 w-full rounded-xl object-cover md:h-52"
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
