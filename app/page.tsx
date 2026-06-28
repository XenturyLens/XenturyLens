import Hero from "@/components/sections/Hero";
import WhatWeDo from "@/components/sections/WhatWeDo";
import SelectedWork from "@/components/sections/SelectedWork";
import TheName from "@/components/sections/TheName";
import Stats from "@/components/sections/Stats";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <SelectedWork />
      <TheName />
      <Stats />
      <CTA />
    </main>
  );
}
