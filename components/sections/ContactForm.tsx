"use client";

import { useActionState } from "react";
import { submitEnquiry, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { status: "idle" };

function Field({
  label, name, type = "text", error,
}: { label: string; name: string; type?: string; error?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-grey">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      {error && <span className="mt-1 block text-sm text-accent">{error}</span>}
    </label>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface-2 p-8">
        <p className="font-display text-2xl tracking-[-0.02em] text-ink">Enquiry sent.</p>
        <p className="mt-3 text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.fieldErrors?.name} />
        <Field label="Email" name="email" type="email" error={state.fieldErrors?.email} />
      </div>
      <Field label="Company" name="company" error={state.fieldErrors?.company} />
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-grey">What are you building?</span>
        <textarea
          name="message"
          rows={5}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {state.fieldErrors?.message && (
          <span className="mt-1 block text-sm text-accent">{state.fieldErrors.message}</span>
        )}
      </label>
      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm text-accent">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
