// Idea-box intake for saxtonshowcase.com. Serves both the front-door form
// (/api/idea: name + contact + idea) and Amy's showcase form contract
// (/api/ideas: idea + optional email + page). Every valid submission is
// mailed to Rook and Amelia through Resend - the two inboxes are where an
// owner reads it, so a 2xx goes out only after Resend accepts.
// Secret lives in the Pages project env (RESEND_API_KEY), never in the repo -
// same pattern as MUSE_CONNECTOR_TOKEN in /api/shop-inventory.

// Recipients: set IDEA_TO (comma-separated) in the Pages project env so the
// inboxes are not read out of this public repo. Until it is set, the old
// list below keeps mail flowing. Remove the fallback once IDEA_TO is live.
const FALLBACK_TO = ["rook@mail.instinct.com", "asaxton1010@gmail.com"];
const FROM = "Saxton Showcase <ideas@saxtonshowcase.com>";
const EMAIL = /^[^\s@<>,;"]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
const MAX_BYTES = 32 * 1024;

function recipients(env) {
  const list = String((env && env.IDEA_TO) || "").split(",")
    .map(function (s) { return s.trim(); })
    .filter(function (s) { return EMAIL.test(s); });
  return list.length ? list : FALLBACK_TO;
}

// One line, no control characters: keeps the subject and labels clean.
function flat(v, max) {
  return String(v || "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

// Browsers send Origin on every POST. A post from another site's page is
// refused; tools with no Origin (curl, the no-JS form in older browsers) pass.
function foreignOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  try { return new URL(origin).host !== new URL(request.url).host; } catch (e) { return true; }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" }
  });
}

// Best-effort rate limit: 5 submissions per IP per hour, per isolate.
const seen = new Map();
function limited(ip) {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter(function (t) { return now - t < 3600000; });
  if (hits.length >= 5) return true;
  hits.push(now);
  seen.set(ip, hits);
  return false;
}

export async function onRequest(context) {
  const request = context.request;
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (foreignOrigin(request)) return json({ error: "forbidden" }, 403);
  if (Number(request.headers.get("content-length") || 0) > MAX_BYTES) return json({ error: "too_large" }, 413);

  let fields;
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.indexOf("application/json") > -1) {
      fields = await request.json();
    } else {
      const fd = await request.formData();
      fields = Object.fromEntries(fd.entries());
    }
  } catch (e) {
    return json({ error: "bad_request" }, 400);
  }

  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return json({ error: "bad_request" }, 400);

  // Honeypot: both forms hide a "website" field from people; bots fill it.
  // Pretend success so they move on, but mail nothing.
  if (String(fields.website || "").trim() !== "") return json({ ok: true });

  // Two shapes: front door (name/contact/idea) and showcase contract
  // (idea/email/page). idea is the only required field.
  const name = flat(fields.name, 100);
  const contact = flat(fields.contact || fields.email, 200);
  const idea = String(fields.idea || "").trim();
  if (idea.length < 5 || idea.length > 2000) return json({ error: "missing_fields" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  const key = context.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 500);

  const lines = [
    "New idea from the Saxton Showcase board",
    "",
    "Name: " + (name || "(not given)"),
    "Contact: " + (contact || "(not given)"),
    fields.page ? "Page: " + flat(fields.page, 100) : "",
    "",
    idea,
    "",
    "Sent " + new Date().toISOString() + " via saxtonshowcase.com"
  ].filter(function (l) { return l !== ""; });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: "Bearer " + key,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: FROM,
      to: recipients(context.env),
      reply_to: EMAIL.test(contact) ? contact : undefined,
      subject: "New idea from " + (name || "a visitor") + " - Saxton Showcase",
      text: lines.join("\n")
    })
  });

  if (!res.ok) return json({ error: "send_failed" }, 502);
  return json({ ok: true });
}
