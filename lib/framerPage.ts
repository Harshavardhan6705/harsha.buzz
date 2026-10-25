import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Serves one page of the original Framer static export as the route's HTML
 * document, byte-for-byte as authored (its own <head> carries the
 * title/description/OG/Twitter/favicon tags).
 *
 * The page is returned as a plain document rather than rendered through a
 * React page component: wrapping it in a Server Component made Next embed the
 * whole markup a second time in its RSC payload (≈2× the HTML bytes) and ship
 * Next's own client runtime just to hydrate a static <div> — while the Framer
 * runtime (`/_fr/*`) already hydrates the page itself.
 *
 * Route handlers using this are `force-static`, so the HTML is read once at
 * build time and served as a prerendered static file.
 */
export function framerPageResponse(source: string): Response {
  const html = readFileSync(join(process.cwd(), source), "utf8");
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
