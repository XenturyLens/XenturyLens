import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import ContactForm from "@/components/sections/ContactForm";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Let's build something that lasts.",
};

export default function ContactPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-6 max-w-[14ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          Let&apos;s build something that lasts.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          Tell us what you&apos;re making. We reply to every serious enquiry within two business days.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <ContactForm />
          <aside className="space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Email</p>
              <a href={`mailto:${contact.email}`} className="mt-2 block text-ink hover:text-accent transition-colors">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Working with</p>
              <p className="mt-2 text-ink">{contact.workingWith}</p>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
