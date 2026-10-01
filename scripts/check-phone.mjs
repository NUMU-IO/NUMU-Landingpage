// node scripts/check-phone.mjs — exits non-zero if phone normalisation regresses.
import assert from "node:assert/strict";
import { toE164 } from "../lib/phone.ts";

const cases = [
  ["01012345678", "+201012345678"],
  ["1012345678", "+201012345678"],
  ["+20 101 234 5678", "+201012345678"],
  ["00201012345678", "+201012345678"],
  ["٠١٠١٢٣٤٥٦٧٨", "+201012345678"],
  ["0512345678", "+966512345678"],
  ["+966 51 234 5678", "+966512345678"],
  ["00966512345678", "+966512345678"],
  ["+971501234567", "+971501234567"],
  ["0223456789", null],
  ["123", null],
  ["", null],
];

for (const [input, expected] of cases) {
  assert.equal(toE164(input), expected, `toE164(${JSON.stringify(input)})`);
}
console.log(`phone: ${cases.length} cases ok`);
