export type SupportedLanguage = 'en' | 'th' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

export const LOCALE_MAP: Record<string, string> = {
  th: 'th-TH',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  es: 'es-ES',
  fr: 'fr-FR',
  en: 'en-US',
};

export function getLocaleTag(lang?: string): string {
  if (!lang) return 'en-US';
  return LOCALE_MAP[lang] || 'en-US';
}

export function parseDate(val: string | number | Date | undefined | null): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    // If it's a YYYY-MM-DD string without time, parse with local midnight to avoid timezone day shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const d = new Date(val + 'T00:00:00');
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatDateTime(
  val: string | number | Date | undefined | null,
  lang: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const d = parseDate(val);
  if (!d) return val ? String(val) : '';
  const locale = getLocaleTag(lang);
  try {
    return d.toLocaleString(locale, options);
  } catch {
    return d.toLocaleString('en-US', options);
  }
}

export function formatDate(
  val: string | number | Date | undefined | null,
  lang: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const d = parseDate(val);
  if (!d) return val ? String(val) : '';
  const locale = getLocaleTag(lang);
  try {
    return d.toLocaleDateString(locale, options);
  } catch {
    return d.toLocaleDateString('en-US', options);
  }
}

export function formatTime(
  val: string | number | Date | undefined | null,
  lang: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const d = parseDate(val);
  if (!d) return val ? String(val) : '';
  const locale = getLocaleTag(lang);
  try {
    return d.toLocaleTimeString(locale, options);
  } catch {
    return d.toLocaleTimeString('en-US', options);
  }
}
