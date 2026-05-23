"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border border-cyan-300/50 bg-gradient-to-b from-cyan-300 via-sky-400 to-blue-500 text-slate-950 shadow-[0_8px_0_0_rgba(8,47,73,.85),0_0_28px_rgba(56,189,248,.45)] hover:-translate-y-0.5 hover:shadow-[0_10px_0_0_rgba(8,47,73,.88),0_0_36px_rgba(56,189,248,.6)] active:translate-y-1 active:shadow-[0_4px_0_0_rgba(8,47,73,.9),0_0_18px_rgba(56,189,248,.4)]",
        ghost: "text-slate-100 hover:bg-white/10",
        outline:
          "border border-cyan-300/60 bg-slate-900/70 text-cyan-100 shadow-[0_6px_0_0_rgba(12,74,110,.7)] hover:-translate-y-0.5 hover:bg-cyan-500/15 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(12,74,110,.8)]"
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-xl px-6",
        sm: "h-8 rounded-md px-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
