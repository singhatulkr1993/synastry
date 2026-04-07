import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { sessionStore } from "@/lib/sessionStore";

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { personA, personB } = await req.json();

    const order = await rzp.orders.create({
      amount: 19900, // ₹199 in paise
      currency: "INR",
      receipt: `compat_${Date.now()}`,
      notes: { personA: String(personA), personB: String(personB) },
    });

    sessionStore.set(order.id as string, {
      paid: false,
      personA: String(personA),
      personB: String(personB),
    });

    return NextResponse.json({
      orderId: order.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 19900,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
