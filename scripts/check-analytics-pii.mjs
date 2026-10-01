// node scripts/check-analytics-pii.mjs — exits non-zero if signup analytics
// starts sending a merchant's contact details to PostHog again.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const analytics = readFileSync(new URL("../lib/analytics.ts", import.meta.url), "utf8");
const modal = readFileSync(new URL("../components/SignupModal.tsx", import.meta.url), "utf8");

const fn = analytics.slice(analytics.indexOf("export function identifySignup"));
const body = fn.slice(0, fn.indexOf("\n}") + 2);
assert.match(body, /identifySignup\(userId: string, props\?: Props\)/, "identifySignup takes only an id and props");
assert.doesNotMatch(body, /\$email|\$name|phone|email/i, "identifySignup sends no contact details");

const call = modal.slice(modal.indexOf("identifySignup("));
const args = call.slice(0, call.indexOf(");") + 2);
assert.doesNotMatch(args, /res\.user\.(email|phone|first_name|last_name)|e164|\$email|\$name/, "SignupModal passes no contact details");

console.log("analytics pii: ok");
