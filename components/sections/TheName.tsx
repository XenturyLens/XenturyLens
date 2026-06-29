"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { theName } from "@/lib/content";

export default function TheName() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

  if (reduce) {
    return (
      <section className="border-t border-border py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">{theName.lead}</p>
          <p className="mt-8 max-w-3xl font-display text-3xl leading-tight tracking-[-0.02em] text-ink md:text-4xl">
            {theName.body}
          </p>
        </div>
      </section>
    );
  }

  // Tall track; inner content pins to viewport center and reacts to scroll.
  return (
    <section ref={ref} className="relative h-[130vh] border-t border-border">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">{theName.lead}</p>
          <motion.p
            style={{ opacity, scale, transformOrigin: "left center" }}
            className="mt-8 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-6xl"
          >
            Xenturylens — a <span className="text-accent">{theName.century}</span> seen through a{" "}
            <span className="text-accent">{theName.lens}</span>. We make decisions for the version of
            your product that exists a hundred years from now.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
