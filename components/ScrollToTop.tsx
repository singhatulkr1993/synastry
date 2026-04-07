"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes.
 * Include this component once in your layout (inside <body>).
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
