import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import Values from "@/components/sections/Values";
import People from "@/components/sections/People";

export const metadata: Metadata = {
  title: "Studio",
  description: "A small team with a long horizon.",
};

export default function StudioPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>The studio</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          A small team with a long horizon.
        </h1>
      </Section>
      <Section className="pt-0"><Values /></Section>
      <Section className="border-t border-border">
        <Eyebrow>The people</Eyebrow>
        <div className="mt-12"><People /></div>
      </Section>
    </main>
  );
}
