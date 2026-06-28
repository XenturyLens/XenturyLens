import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional().default(""),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)."),
});

export type ContactInput = z.infer<typeof contactSchema>;
