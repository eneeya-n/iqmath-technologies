import Image from "next/image";
import { Card } from "@/components/ui/card";

const certs = [
  "https://images.unsplash.com/photo-1563996768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80"
];

export function CertificateGallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-3xl font-semibold text-white">Certificate Showcase</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {certs.map((src) => (
          <Card key={src} className="p-2">
            <Image
              src={src}
              alt="IQMath certificate sample"
              width={500}
              height={300}
              className="h-52 w-full rounded-xl object-cover"
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
