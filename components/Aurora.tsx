"use client";

export default function Aurora() {
  // Visible only in dark mode (token --glow is transparent in light).
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "var(--glow)" }}
      />
    </div>
  );
}
