// Deck Check intake: Joe's MTG deck-builder preferences. The unlisted page
// at /deck-check/ posts here; every valid submission is mailed to Rook and
// Amelia through Resend, so a 2xx goes out only after Resend accepts.
// Same pattern as /api/idea: honeypot fakes success, per-IP rate limit,
// secret lives in the Pages project env (RESEND_API_KEY), never in the repo.

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

function one(v, max) {
  return String(v || "").trim().slice(0, max);
}

function many(fd, key, maxCount, maxLen) {
  return fd.getAll(key).map(function (v) { return one(v, maxLen); })
    .filter(function (v) { return v !== ""; }).slice(0, maxCount);
}

export async function onRequest(context) {
  const request = context.request;
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (foreignOrigin(request)) return json({ error: "forbidden" }, 403);
  if (Number(request.headers.get("content-length") || 0) > MAX_BYTES) return json({ error: "too_large" }, 413);

  let fd;
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.indexOf("application/json") > -1) {
      const body = await request.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "bad_request" }, 400);
      fd = new Map(Object.entries(body));
      fd.getAll = function (k) {
        const v = this.get(k);
        return Array.isArray(v) ? v : (v === undefined ? [] : [v]);
      };
      fd.entries = Map.prototype.entries.bind(fd);
    } else {
      fd = await request.formData();
    }
  } catch (e) {
    return json({ error: "bad_request" }, 400);
  }

  // Honeypot: the page hides a "website" field from people; bots fill it.
  // Pretend success so they move on, but mail nothing.
  if (one(fd.get ? fd.get("website") : "", 200) !== "") return json({ ok: true });

  const name = flat(fd.get("name"), 100);
  const contact = flat(fd.get("contact"), 200);
  const format = flat(fd.get("format"), 40);
  const formatOther = one(fd.get("format_other"), 100);
  const colors = many(fd, "colors", 6, 20);
  const budget = one(fd.get("budget"), 40);
  const bracket = one(fd.get("bracket"), 40);
  const power = one(fd.get("power"), 40); // legacy 1-10 field, kept so an old open tab still mails cleanly
  const commander = one(fd.get("commander"), 200);
  const avoid = many(fd, "avoid", 8, 40);
  const start = one(fd.get("start"), 60);
  const deckList = one(fd.get("deck_list"), 1000);
  const proxies = one(fd.get("proxies"), 40);
  const platform = one(fd.get("platform"), 20);
  const win = many(fd, "win", 12, 60);
  const ramble = one(fd.get("ramble"), 4000);

  const anything = name || contact || format || formatOther || budget || power ||
    bracket || commander || start || deckList || proxies || platform ||
    ramble || colors.length || win.length || avoid.length;
  if (!anything) return json({ error: "missing_fields" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  const key = context.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 500);

  const lines = [
    "Deck Check - new deck-builder preferences",
    "",
    "Name: " + (name || "(not given)"),
    "Contact: " + (contact || "(not given)"),
    "Format: " + (format === "Other" && formatOther ? "Other - " + formatOther : (format || "(not picked)")),
    "Commander in mind: " + (commander || (format === "Commander" ? "(not given)" : "(n/a - not Commander)")),
    "Colors: " + (colors.length ? colors.join(", ") : "(not picked)"),
    "Bracket: " + (bracket || (power ? "(old form) " + power : (format === "Commander" ? "(not picked)" : "(n/a - not Commander)"))),
    "Budget: " + (budget || "(not picked)"),
    "Likes to win: " + (win.length ? win.join(", ") : "(not picked)"),
    "Keep out of the deck: " + (avoid.length ? avoid.join(", ") : "(not picked)"),
    "Starting point: " + (start || "(not picked)"),
    "List / what's in the box: " + (deckList || "(not given)"),
    "Proxies OK: " + (proxies || "(not picked)"),
    "Played on: " + (platform || "(not picked)"),
    "",
    "Ramble:",
    ramble || "(nothing)",
    "",
    "Sent " + new Date().toISOString() + " via saxtonshowcase.com/deck-check"
  ];

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
      subject: "Deck Check: " + (name || "a brewer") + (format ? " wants a " + format + " deck" : " sent preferences"),
      text: lines.join("\n")
    })
  });

  if (!res.ok) return json({ error: "send_failed" }, 502);
  return json({ ok: true });
}
