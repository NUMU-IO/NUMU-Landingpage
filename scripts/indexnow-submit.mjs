/**
 * Announce numueg.app's pages to IndexNow after a production deploy.
 *
 * Storefronts have had this since the SEO tier-1 work — NUMU-api pings each
 * store's `/api/indexnow` on publish. The marketing site never did, so every
 * new /tools page and every pricing change reached Bing only whenever it next
 * decided to recrawl. That matters more than it sounds: Bing's index is what
 * backs ChatGPT search, and the /tools pages are the only surface here that
 * earns traffic from people who have never heard of NUMU.
 *
 * Why a post-deploy script rather than a runtime hook: this site is a static
 * SPA with no server to ping from. The submission therefore has to be driven
 * from outside, after the new build is actually live.
 *
 * THE KEY PAIRING
 * IndexNow proves host ownership by asking you to serve a file whose NAME is
 * the key and whose CONTENT is the same key:
 *
 *     public/<key>.txt  →  https://numueg.app/<key>.txt
 *
 * `KEY` below MUST equal the basename of that file. If they drift, IndexNow
 * answers 403 and every submission is silently discarded — there is no other
 * channel through which we would find out, so this script verifies the live
 * file before submitting anything.
 *
 * It deliberately shares the storefront key. IndexNow keys are ownership
 * proofs, not secrets — the file is published at the site root by design — and
 * one key per organisation means one thing to rotate.
 *
 * Usage:
 *     node scripts/indexnow-submit.mjs              # submit sitemap URLs
 *     node scripts/indexnow-submit.mjs --dry-run    # show what would be sent
 */

// Overridable so the whole flow can be exercised against a local `serve dist`
// before it is ever pointed at production. Submission still refuses any URL
// that is not on this host, so a stray override cannot announce someone
// else's pages under our key.
const SITE = (process.env.INDEXNOW_SITE ?? "https://numueg.app").replace(/\/+$/, "");
const KEY = "b9d920e28856ebec9ccfed18d16178d9";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const dryRun = process.argv.includes("--dry-run");

/**
 * Throw rather than process.exit(). Calling exit() while an undici socket is
 * still open trips a libuv assertion on Windows and reports exit code 127
 * instead of 1 — so the one thing CI keys off would have been wrong, and the
 * useful error message was buried under a crash dump.
 */
const fail = (msg) => {
  throw new Error(msg);
};

async function main() {
  // 1. The proof file must be live and correct, or the submission is discarded
  //    silently. Checking the body matters as much as the status: this site
  //    rewrites unknown paths to /index.html, so a missing key file answers 200
  //    with the SPA shell rather than 404 — which is exactly how it went
  //    unnoticed that the marketing site had no IndexNow at all.
  const keyUrl = `${SITE}/${KEY}.txt`;
  const keyRes = await fetch(keyUrl);
  if (!keyRes.ok) fail(`Key file ${keyUrl} returned ${keyRes.status}`);

  const keyBody = (await keyRes.text()).trim();
  if (keyBody !== KEY) {
    fail(
      `Key file ${keyUrl} does not contain the key. Got ${JSON.stringify(
        keyBody.slice(0, 60),
      )}. If that looks like HTML, public/${KEY}.txt is not deployed and the ` +
        `catch-all rewrite is answering instead.`,
    );
  }
  console.log(`[ok] Key file verified at ${keyUrl}`);

  // 2. Submit exactly what the sitemap advertises, read from the live site
  //    rather than the local build — the point is to announce what is actually
  //    serving, and a local dist/ can be ahead of production.
  const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
  if (!sitemapRes.ok) fail(`sitemap.xml returned ${sitemapRes.status}`);
  const urls = [...(await sitemapRes.text()).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(
    (m) => m[1],
  );
  if (urls.length === 0) fail("sitemap.xml parsed but contained no <loc> entries");

  const offSite = urls.filter((u) => !u.startsWith(SITE));
  if (offSite.length > 0) {
    // Every URL must share the host we proved ownership of; one stray entry
    // makes IndexNow reject the whole submission, not just that URL.
    fail(
      `sitemap contains URLs outside ${SITE}: ${offSite.slice(0, 3).join(", ")}` +
        (process.env.INDEXNOW_SITE
          ? "\n     INDEXNOW_SITE is set, so this is expected when testing against a " +
            "local build: sitemap.xml hardcodes production URLs. Everything up to " +
            "this point (key file, sitemap parse) has been verified."
          : ""),
    );
  }

  console.log(`[--] ${urls.length} URL(s) from sitemap.xml`);
  if (dryRun) {
    urls.forEach((u) => console.log(`     ${u}`));
    console.log("\n[--] Dry run — nothing submitted.");
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: keyUrl,
      urlList: urls,
    }),
  });

  // 200 and 202 both mean accepted; 202 is "received, key validation pending".
  if (res.status === 200 || res.status === 202) {
    console.log(`[ok] Submitted ${urls.length} URL(s) to IndexNow (${res.status}).`);
    return;
  }

  // 422 is the one worth calling out: it means the URLs did not match the key's
  // host, which is a configuration error rather than a transient failure.
  const body = (await res.text()).slice(0, 300);
  fail(`IndexNow rejected the submission: ${res.status} ${body}`);
}

main().catch((err) => {
  console.error(`::error::${err.message}`);
  // Set the code and let the event loop drain naturally; see fail() above.
  process.exitCode = 1;
});
