import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { sessionStore } from "@/lib/sessionStore";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const session = sessionStore.get(razorpay_order_id);
    if (session) session.paid = true;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
