import { cn } from "@/lib/cn";

export default function ImageSlot({
  label, className, ratio = "16/10",
}: { label: string; className?: string; ratio?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface-2",
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 120% at 0% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%), radial-gradient(120% 120% at 100% 100%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 flex items-end p-5">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{label}</span>
      </div>
    </div>
  );
}
