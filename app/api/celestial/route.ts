import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { dob, birthTime } = await req.json() as { dob: string; birthTime: string };

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 128,
      messages: [
        {
          role: "user",
          content: `Given birth date ${dob} and birth time ${birthTime}, calculate the Moon sign and Venus sign for astrological purposes. Return ONLY a JSON object in this exact format with no other text: {"moonSign": "SignName", "venusSign": "SignName"}. Use standard Western astrology calculations. SignName must be one of: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    // Extract JSON even if there's surrounding text
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const parsed = JSON.parse(match[0]) as { moonSign?: string; venusSign?: string };

    const validSigns = new Set(["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]);
    return NextResponse.json({
      moonSign:  validSigns.has(parsed.moonSign  ?? "") ? parsed.moonSign  : null,
      venusSign: validSigns.has(parsed.venusSign ?? "") ? parsed.venusSign : null,
    });
  } catch (err) {
    console.error("Celestial calculation failed:", err);
    return NextResponse.json({ moonSign: null, venusSign: null });
  }
}
