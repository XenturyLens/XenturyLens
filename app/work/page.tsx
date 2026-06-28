import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import WorkGrid from "@/components/sections/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "Products we shipped, and still tend to.",
};

export default function WorkPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Selected work</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          Products we shipped, and still tend to.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          A studio is judged by what survives. These are built to.
        </p>
      </Section>
      <Section className="pt-0">
        <WorkGrid />
      </Section>
    </main>
  );
}
