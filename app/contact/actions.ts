"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return { status: "error", message: "Email isn't configured yet. Reach us at studio@xenturylens.com." };
  }

  const { name, email, company, message } = parsed.data;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `New enquiry from ${name}`,
    html: `<h2>New enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "—"}</p>
      <p><strong>Building:</strong></p><p>${message}</p>`,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your enquiry. Please email us directly." };
  }
  return { status: "success", message: "Thank you — we reply to every serious enquiry within two business days." };
}
