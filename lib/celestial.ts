export interface CelestialSigns {
  moonSign: string | null;
  venusSign: string | null;
}

export async function calculateCelestialSigns(
  dob: string,
  birthTime: string | null
): Promise<CelestialSigns> {
  if (!birthTime) return { moonSign: null, venusSign: null };
  try {
    const res = await fetch("/api/celestial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dob, birthTime }),
    });
    if (!res.ok) return { moonSign: null, venusSign: null };
    const data = await res.json() as { moonSign?: string; venusSign?: string };
    return {
      moonSign: typeof data.moonSign === "string" ? data.moonSign : null,
      venusSign: typeof data.venusSign === "string" ? data.venusSign : null,
    };
  } catch {
    return { moonSign: null, venusSign: null };
  }
}
