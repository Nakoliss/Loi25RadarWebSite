import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  domain: z.string().optional(),
  auditType: z.string().optional(),
  message: z.string().max(500).optional(),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, email, phone, domain, auditType, message, locale } =
      parsed.data;

    // Send email using our new generic service
    const emailResult = await sendContactEmail({
      name,
      email,
      phone,
      domain,
      auditType,
      message,
      locale: locale || "fr",
      timestamp: new Date().toISOString(),
    });

    if (!emailResult.success) {
      console.warn("Email sending failed:", emailResult.error);
      // We still return success to the client so they don't see an error,
      // but we logged it on the server.
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 },
    );
  }
}
