# Product screenshot capture and redaction

**Captured:** 2026-08-23 · **Source:** `merchant.numueg.app`, live Vionne store
**Owner sign-off:** capture-with-redaction approved by the project owner.

The product screenshots in `public/assets/` are real frames of the NUMU
merchant hub, not mockups. Because they were taken from a live trading store,
every real value was replaced **in the DOM before the shot was taken** — there
is no blur, no black box and no post-editing, so the UI reads as genuine while
carrying no real data.

`assets/asset-plan.md` requires that screenshots contain no real customer
names, phone numbers, addresses hdh dh, API keys or internal URLs. This is how that
was satisfied.

## Method

A `MutationObserver`-backed text redactor was installed on the page, so React
re-renders could not restore the original values between the edit and the
capture. It ran three passes:

1. **Enumerated substitutions** — every real name, email, address, product
   title and SKU observed on the store, mapped to a fictional stand-in.
2. **Pattern substitutions** — any Egyptian mobile number
   (`/(\+?2?0?1[0-9]{9})/`) became `01X XXXX XXXX`; any email address became
   `karim.hassan@example.com`.
3. **Leaf-element substitutions** — for values split across sibling text nodes
   (`"249.3"` + `"%"`), which a text-node pass alone cannot match.

Each capture was then re-scanned for leaked patterns before being saved, and
each scan returned empty.

## What was changed

| Real value | Published as |
|---|---|
| Store identity (`Vionne`, `vionneegy`, `vionneeg.com`) | `Nour`, `nour-atelier`, `nouratelier.com` |
| Staff first name | `Layla` |
| 11 customer names (Arabic and Latin) | Fictional Egyptian names |
| Customer email | `karim.hassan@example.com` |
| Customer mobile numbers | `01X XXXX XXXX` |
| Street address in Shubra | `١٢ شارع النيل، المعادي` |
| Product titles and SKUs | `Linen scarf — sage`, `SKU-LN-0142`, … |
| 30-day revenue, net profit, orders, visitors, conversion, AOV, targets | Round demo figures |

## Known limitation — merchant imagery

Text is fully redacted. **Imagery is not**, and cannot be by this method:

- `theme-engine.webp` and `storefront-preview.webp` show the live storefront,
  including the merchant's own brand photography and logo mark.
- `orders-workflow.webp` shows product thumbnails from the merchant's catalogue.

That photography belongs to the merchant, not to Numueg. Before these ship,
either obtain the merchant's written permission to display their imagery on
Numueg's marketing site, or re-capture against a demo store seeded with
Numueg-owned product images. This is tracked as an open launch gate.

## Re-capturing

Screenshots were taken at a 1600×1000 viewport at DPR 2 (3200×2000 source),
cropped 16:10 and encoded to WebP at quality 82, scaled to 2000px wide — which
stays sharp at the ~1200px CSS width the landing page renders them at.
