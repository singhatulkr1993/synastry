import { track as vercelTrack } from "@vercel/analytics";

type TrackProperties = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, properties?: TrackProperties) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event, properties ?? {});
  } else {
    vercelTrack(event, properties);
  }
}
