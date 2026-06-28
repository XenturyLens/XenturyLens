import Link from "next/link";
import { nav, contact } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-display text-2xl tracking-[-0.02em] text-ink">Xenturylens</p>
            <p className="mt-3 max-w-sm text-ink-soft">
              A global product engineering studio. We see beyond the product.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Explore</p>
              <ul className="mt-4 space-y-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-ink-soft hover:text-ink transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Connect</p>
              <ul className="mt-4 space-y-2 text-ink-soft">
                <li><a href={`mailto:${contact.email}`} className="hover:text-ink transition-colors">{contact.email}</a></li>
                <li><span>LinkedIn</span></li>
                <li><span>X / Twitter</span></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.18em] text-grey">
          © 2026 Xenturylens. Built to last. · A hundred-year studio
        </p>
      </div>
    </footer>
  );
}
