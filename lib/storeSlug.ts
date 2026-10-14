/**
 * Store name (Arabic or Latin) → the link it would get: `بيت الخزف` →
 * `bit-el-khzf`. Same rules as the hub's create-store suggestion
 * (numo-merchant-hub src/lib/store-slug.ts), so the preview here matches
 * what the merchant is offered after signing up. Egyptian-leaning spelling
 * (ج → g); short vowels aren't written in Arabic, so it's a suggestion.
 */

const LETTERS: Record<string, string> = {
  ا: 'a', ب: 'b', ت: 't', ث: 'th', ج: 'g', ح: 'h', خ: 'kh', د: 'd',
  ذ: 'z', ر: 'r', ز: 'z', س: 's', ش: 'sh', ص: 's', ض: 'd', ط: 't',
  ظ: 'z', ع: 'a', غ: 'gh', ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm',
  ن: 'n', ه: 'h', و: 'o', ي: 'i', ء: '',
};

function fold(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .trim();
}

function transliterateWord(word: string): string {
  if (word.startsWith('ال') && word.length > 3) return `el-${transliterateWord(word.slice(2))}`;
  return [...word]
    .map((ch, i) => (i === 0 && ch === 'و' ? 'w' : i === 0 && ch === 'ي' ? 'y' : LETTERS[ch] ?? ch))
    .join('');
}

export function toStoreSlug(input: string): string {
  return fold(input.replace(/ة/g, 'a'))
    .split(/\s+/)
    .map(transliterateWord)
    .join('-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
    .replace(/-$/, '');
}
