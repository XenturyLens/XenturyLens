"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { cn } from "@/lib/cn";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--ease-out-expo)]",
        scrolled || open
          ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--surface)_72%,transparent)] border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="font-display text-lg tracking-[-0.02em] text-ink">
          Xenturylens
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90 sm:inline-flex md:hidden lg:inline-flex"
          >
            Start a project
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          >
            <span className="font-mono text-base leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-4">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-2 py-3 text-base transition-colors",
                    active ? "text-ink" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
