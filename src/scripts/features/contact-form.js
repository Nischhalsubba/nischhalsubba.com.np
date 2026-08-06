import { $ } from '../utils/dom.js';

const ENDPOINT = '/api/contact';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const REQUEST_TIMEOUT_MS = 20000;

function errorId(field) {
  const name = (field.name || field.id || 'field').replace(/[^a-z0-9_-]/gi, '-');
  return `contact-error-${name}`;
}

function validationMessage(field) {
  if (field.validity.valueMissing) return 'This field is required.';
  if (field.validity.typeMismatch) return 'Enter a valid email address.';
  if (field.validity.tooShort) return `Use at least ${field.minLength} characters.`;
  if (field.validity.tooLong) return `Use no more than ${field.maxLength} characters.`;
  return field.validationMessage || 'Check this field and try again.';
}

function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  const id = errorId(field);
  document.getElementById(id)?.remove();
  const values = (field.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((value) => value !== id);
  if (values.length) field.setAttribute('aria-describedby', values.join(' '));
  else field.removeAttribute('aria-describedby');
}

function showFieldError(field, message = validationMessage(field)) {
  clearFieldError(field);
  const node = document.createElement('span');
  node.id = errorId(field);
  node.className = 'nrs-contact-field-error';
  node.textContent = message;
  field.setAttribute('aria-invalid', 'true');
  const values = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
  values.add(node.id);
  field.setAttribute('aria-describedby', [...values].join(' '));
  field.insertAdjacentElement('afterend', node);
}

function validate(form) {
  let firstInvalid = null;
  [...form.querySelectorAll('input, select, textarea')]
    .filter((field) => field.type !== 'hidden' && field.name !== '_honey')
    .forEach((field) => {
      clearFieldError(field);
      if (!field.checkValidity()) {
        showFieldError(field);
        firstInvalid ||= field;
      }
    });
  firstInvalid?.focus({ preventScroll: false });
  return !firstInvalid;
}

function applyServerErrors(form, errors = {}) {
  let firstInvalid = null;
  Object.entries(errors).forEach(([name, message]) => {
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLElement)) return;
    showFieldError(field, String(message));
    firstInvalid ||= field;
  });
  firstInvalid?.focus({ preventScroll: false });
}

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  const base = TURNSTILE_SCRIPT.split('?')[0];
  const existing = document.querySelector(`script[src^="${base}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

async function initializeTurnstile(form, setStatus) {
  const siteKey = form.dataset.turnstileSiteKey
    || document.querySelector('meta[name="turnstile-site-key"]')?.content?.trim();
  if (!siteKey) {
    return { ready: false, widgetId: null };
  }

  const host = document.createElement('div');
  host.className = 'nrs-turnstile';
  host.setAttribute('aria-label', 'Anti-spam verification');
  form.querySelector('.nrs-form-actions, .nrs-contact-form-actions')?.before(host);

  try {
    await loadTurnstile();
    const widgetId = window.turnstile.render(host, {
      sitekey: siteKey,
      theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
      'response-field-name': 'cf-turnstile-response',
      callback: () => setStatus('Anti-spam check complete. Your message is ready to send.', 'success'),
      'expired-callback': () => setStatus('The anti-spam check expired. Complete it again.', 'error'),
      'error-callback': () => setStatus('The anti-spam check could not load. Please use the email option.', 'error'),
    });
    return { ready: true, widgetId };
  } catch (error) {
    console.error('[portfolio] Turnstile initialization failed', error);
    setStatus('The protected form is temporarily unavailable. The email option remains available.', 'neutral');
    return { ready: false, widgetId: null };
  }
}

export function initContactForm() {
  const form = $('#contact-form');
  if (!form || form.dataset.contactFormReady === 'true') return;

  form.dataset.contactFormReady = 'true';
  form.noValidate = true;
  form.action = ENDPOINT;
  form.method = 'POST';

  const status = $('#contact-form-status') || form.querySelector('[role="status"]');
  const submit = form.querySelector('button[type="submit"]');
  const emailLink = form.querySelector('a[href^="mailto:"]');
  const originalText = submit?.textContent || 'Send message';
  const setStatus = (message, tone = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  const turnstileState = initializeTurnstile(form, setStatus);
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    if (field.type === 'hidden') return;
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });
  emailLink?.addEventListener('click', () => setStatus('Opening your email app. Your form entries remain here.', 'neutral'));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate(form)) {
      setStatus('Review the highlighted fields and try again.', 'error');
      return;
    }

    const turnstile = await turnstileState;
    if (!turnstile.ready) {
      setStatus('The protected form is unavailable. Please use the email option.', 'error');
      emailLink?.focus({ preventScroll: false });
      return;
    }
    const token = form.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!token) {
      setStatus('Complete the anti-spam check and try again.', 'error');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending...';
    }
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your message securely...', 'neutral');

    const payload = new FormData(form);
    payload.set('source_page', window.location.href);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (result.errors) applyServerErrors(form, result.errors);
        throw new Error(result.message || `The form returned ${response.status}.`);
      }

      form.reset();
      form.querySelectorAll('[aria-invalid="true"]').forEach(clearFieldError);
      if (window.turnstile && turnstile.widgetId !== null) window.turnstile.reset(turnstile.widgetId);
      setStatus(result.message || 'Thanks. Your message was sent successfully.', 'success');
    } catch (error) {
      console.error('[portfolio] contact form submission failed', error);
      const message = error?.name === 'AbortError'
        ? 'The request timed out. Your entries are still here; use the email option or try again.'
        : error.message || 'The form could not send your message. Your entries are still here.';
      setStatus(message, 'error');
      emailLink?.focus({ preventScroll: false });
    } finally {
      window.clearTimeout(timeout);
      form.removeAttribute('aria-busy');
      if (submit) {
        submit.disabled = false;
        submit.textContent = originalText;
      }
    }
  });
}
