import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { planId, customerName, customerEmail, websiteUrl, locale } =
      await req.json();

    if (!planId || !customerName || !customerEmail || !websiteUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const line_items: any[] = [];
    const lang = (locale || "fr") as "fr" | "en";

    if (plan.mode === "payment") {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: plan.name[lang],
            description: websiteUrl,
          },
          unit_amount: (plan as any).price * 100,
        },
        quantity: 1,
      });
    } else if (plan.mode === "subscription") {
      // For Compliance Manager: $699 one-time + $79/month
      // Line item 1: One-time fee
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: `${plan.name[lang]} - Frais d'installation / Mise en conformité`,
            description: websiteUrl,
          },
          unit_amount: (plan as any).oneTimePrice * 100,
        },
        quantity: 1,
      });

      // Line item 2: Recurring subscription
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: `${plan.name[lang]} - Abonnement mensuel`,
            description: `Monitoring pour ${websiteUrl}`,
          },
          unit_amount: (plan as any).recurringPrice * 100,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: plan.mode,
      customer_email: customerEmail,
      metadata: {
        customerName,
        customerEmail,
        websiteUrl,
        planId,
        planName: plan.name[lang],
      },
      success_url: `${req.nextUrl.origin}/${lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/${lang}/checkout/cancel`,
      locale: lang,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
