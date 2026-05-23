import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
