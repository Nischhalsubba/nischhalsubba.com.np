const PRODUCTION_ORIGINS = new Set([
  'https://nischhalsubba.com.np',
  'https://www.nischhalsubba.com.np',
]);

const PRODUCTION_HOSTNAMES = new Set([
  'nischhalsubba.com.np',
  'www.nischhalsubba.com.np',
]);

export const CONTACT_LIMITS = Object.freeze({
  requestBytes: 16_384,
  name: 100,
  email: 254,
  category: 100,
  message: 5_000,
  sourcePage: 500,
  turnstileToken: 2_048,
});

export function isAllowedOrigin(value) {
  if (!value) return true;
  let origin;
  try {
    origin = new URL(value);
  } catch {
    return false;
  }

  if (PRODUCTION_ORIGINS.has(origin.origin)) return true;
  return origin.protocol === 'https:' && origin.hostname.endsWith('.pages.dev');
}

export function isSupportedContentType(value) {
  const type = String(value || '').split(';', 1)[0].trim().toLowerCase();
  return type === 'multipart/form-data' || type === 'application/x-www-form-urlencoded';
}

export function exceedsRequestLimit(value) {
  if (!value) return false;
  const bytes = Number.parseInt(value, 10);
  return Number.isFinite(bytes) && bytes > CONTACT_LIMITS.requestBytes;
}

export function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

export function validateContactFields(fields) {
  const errors = {};
  if (fields.name.length < 2) errors.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (!fields.need) errors.need = 'Select a project type.';
  if (!fields.timeline) errors.timeline = 'Select a timeline.';
  if (fields.message.length < 20) errors.message = 'Add at least 20 characters of project context.';
  return errors;
}

export function isValidTurnstileResult(result, requestHostname) {
  if (!result?.success) return false;
  if (result.action !== 'portfolio-contact') return false;

  const hostname = String(result.hostname || '').toLowerCase();
  if (PRODUCTION_HOSTNAMES.has(hostname)) return true;
  if (hostname.endsWith('.pages.dev')) return true;

  return requestHostname === 'localhost' && hostname === 'localhost';
}
