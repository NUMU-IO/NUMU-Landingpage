/**
 * Egyptian mobile numbers, normalised to E.164 for the API.
 *
 * The signup form never asked for a phone number, which is why the
 * platform has almost none: wallet low-balance warnings go out by email
 * only, and sales has no way to reach a merchant who stops mid-setup —
 * in a market where WhatsApp is the channel that actually gets read.
 *
 * Deliberately hand-rolled rather than pulling in libphonenumber-js: the
 * landing ships to shoppers on slow connections and this is one country's
 * mobile format. The API re-validates with the real parser and rejects
 * anything wrong, so this is a courtesy check, not the authority.
 */

/** Egyptian mobile: +20 then 1, then one of 0/1/2/5, then 8 digits. */
const E164_EG_MOBILE = /^\+201[0125]\d{8}$/;

/**
 * Accepts what Egyptians actually type — `01001234567`, `1001234567`,
 * `+20 100 123 4567`, `0020...`, with spaces or dashes anywhere — and
 * returns canonical E.164, or `null` when it is not a valid EG mobile.
 */
export function toE164Eg(input: string): string | null {
  if (!input) return null;

  // Arabic-Indic digits, since an Arabic keyboard produces them.
  const latinised = input.replace(/[٠-٩]/g, (d) =>
    String(d.charCodeAt(0) - 0x0660),
  );

  let digits = latinised.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("20")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  const candidate = `+20${digits}`;
  return E164_EG_MOBILE.test(candidate) ? candidate : null;
}

export function phoneError(isAr: boolean): string {
  return isAr
    ? "اكتب رقم موبايل مصري صحيح (مثال: 01001234567)."
    : "Enter a valid Egyptian mobile number (e.g. 01001234567).";
}
