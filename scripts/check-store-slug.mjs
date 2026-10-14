// node scripts/check-store-slug.mjs — exits non-zero if the store-link preview regresses.
// Same cases as the hub's src/lib/__tests__/store-slug.test.ts.
import assert from "node:assert/strict";
import { toStoreSlug } from "../lib/storeSlug.ts";

const cases = [
  ["بيت الخزف", "bit-el-khzf"],
  ["وردة", "wrda"],
  ["متجر ٢٠٢٦", "mtgr-2026"],
  ["  My Fashion Store! ", "my-fashion-store"],
];

for (const [input, expected] of cases) {
  assert.equal(toStoreSlug(input), expected, `toStoreSlug(${JSON.stringify(input)})`);
}
console.log(`store slug: ${cases.length} cases ok`);
