import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sendPaymentNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 },
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log(`🔔 Webhook hit for session: ${session.id}`);

    // Extract metadata
    const { customerName, customerEmail, websiteUrl, planName } =
      session.metadata || {};

    const paymentData = {
      customerName:
        customerName || session.customer_details?.name || "Client Inconnu",
      customerEmail:
        customerEmail || session.customer_details?.email || "Email Inconnu",
      websiteUrl: websiteUrl || "URL Inconnue",
      planName: planName || "Forfait Inconnu",
      amount: session.amount_total / 100,
      currency: session.currency,
      status: session.payment_status,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send email notification to ADMIN
      await sendPaymentNotificationEmail(paymentData);
      console.log(`✅ Admin notification sent for session ${session.id}`);

      // Send confirmation to CUSTOMER (optional but professional)
      await sendPaymentNotificationEmail({
        ...paymentData,
        isToCustomer: true,
      });
      console.log(
        `✅ Customer confirmation sent to ${paymentData.customerEmail}`,
      );
    } catch (emailError) {
      console.error("❌ Email sending failed in webhook:", emailError);
    }
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";
