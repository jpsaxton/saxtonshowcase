// Builds cut from the shelf on 2026-09-23 answer 404 instead of the homepage fallback.
const CUT = new Set(["drape","xpbd-lab","taut","xpbd-cloth","drape-rope","sway-net","verlet","linen","drape-scenes","loom","reaction","turing-pool","driftfield","gamut-second-take","seam"]);
const PAGE = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not on the shelf - Saxton Showcase</title><body style="font-family:system-ui,sans-serif;background:#F7F4FF;color:#1A1540;padding:48px 24px;max-width:560px;margin:auto"><h1>That one is off the shelf.</h1><p>We cut this build. <a href="/shelf/" style="color:#1A1540;font-weight:700">See what is on the shelf now</a>.</p></body></html>';
export async function onRequest(context) {
  const slug = new URL(context.request.url).pathname.split("/")[2] || "";
  if (CUT.has(slug)) {
    return new Response(PAGE, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
  return context.next();
}
