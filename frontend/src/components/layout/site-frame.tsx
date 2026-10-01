"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const enroll = pathname.startsWith("/register");

  useEffect(() => {
    document.documentElement.classList.toggle("enroll-light", enroll);
  }, [enroll]);

  if (enroll) return <>{children}</>;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      {children}
    </>
  );
}
