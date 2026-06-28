import { cn } from "@/lib/cn";

export default function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs uppercase tracking-[0.18em] text-grey", className)}>
      {children}
    </p>
  );
}
