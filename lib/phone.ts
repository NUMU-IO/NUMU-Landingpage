/**
 * Mobile numbers, normalised to E.164 for the API.
 *
 * The signup form never asked for a phone number, which is why the
 * platform has almost none: wallet low-balance warnings go out by email
 * only, and sales has no way to reach a merchant who stops mid-setup —
 * in a market where WhatsApp is the channel that actually gets read.
 *
 * Deliberately hand-rolled rather than pulling in libphonenumber-js: the
 * landing ships to shoppers on slow connections. Egyptian local formats are
 * normalised in full, a Saudi local 05… number is mapped to +966, and any
 * other number typed with its international prefix passes through. The API
 * re-validates with the real parser and rejects anything wrong, so this is
 * a courtesy check, not the authority.
 */

/** Egyptian mobile: +20 then 1, then one of 0/1/2/5, then 8 digits. */
const E164_EG_MOBILE = /^\+201[0125]\d{8}$/;

/**
 * Accepts what merchants actually type — `01001234567`, `1001234567`,
 * `+20 100 123 4567`, `0020...`, `0512345678`, `+966 51 234 5678`, with
 * spaces or dashes anywhere — and returns E.164, or `null` when it is not
 * a plausible mobile number.
 */
export function toE164(input: string): string | null {
  if (!input) return null;

  // Arabic-Indic digits, since an Arabic keyboard produces them.
  const latinised = input
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

  let digits = latinised.replace(/\D/g, "");
  if (!digits) return null;

  // Typed with its international prefix and not Egypt: the server parses it.
  const international = latinised.startsWith("+") || digits.startsWith("00");
  if (international) {
    const rest = digits.startsWith("00") ? digits.slice(2) : digits;
    if (!rest.startsWith("20")) {
      return /^[1-9]\d{7,14}$/.test(rest) ? `+${rest}` : null;
    }
  }

  // Saudi local mobile: 05 then 8 digits.
  if (/^05\d{8}$/.test(digits)) return `+966${digits.slice(1)}`;

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("20")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  const candidate = `+20${digits}`;
  return E164_EG_MOBILE.test(candidate) ? candidate : null;
}
