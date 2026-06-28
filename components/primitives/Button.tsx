import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Button({
  href, children, variant = "primary", className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const styles = {
    primary: "bg-ink text-surface hover:opacity-90",
    ghost: "border border-border text-ink hover:bg-surface-2",
  }[variant];
  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}
