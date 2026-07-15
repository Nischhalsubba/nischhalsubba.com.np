import { $ } from '../utils/dom.js';

const CONTACT_EMAIL = 'hinischhalsubba@gmail.com';
const FALLBACK_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const FIRST_PARTY_ENDPOINT = '/api/contact';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const REQUEST_TIMEOUT_MS = 15000;

function getFieldErrorId(field) {
  const safeName = (field.name || field.id || 'field').replace(/[^a-z0-9_-]/gi, '-');
  return `contact-error-${safeName}`;
}

function getValidationMessage(field) {
  if (field.validity.valueMissing) return 'This field is required.';
  if (field.validity.typeMismatch) return 'Enter a valid email address.';
  if (field.validity.tooShort) return `Use at least ${field.minLength} characters.`;
  if (field.validity.tooLong) return `Use no more than ${field.maxLength} characters.`;
  return field.validationMessage || 'Check this field and try again.';
}

function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  const errorId = getFieldErrorId(field);
  document.getElementById(errorId)?.remove();

  const describedBy = (field.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((id) => id !== errorId);

  if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
  else field.removeAttribute('aria-describedby');
}

function showFieldError(field, message = getValidationMessage(field)) {
  clearFieldError(field);

  const error = document.createElement('span');
  const errorId = getFieldErrorId(field);
  error.id = errorId;
  error.className = 'nrs-contact-field-error';
  error.textContent = message;

  field.setAttribute('aria-invalid', 'true');
  const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
  describedBy.add(errorId);
  field.setAttribute('aria-describedby', [...describedBy].join(' '));
  field.insertAdjacentElement('afterend', error);
}

function validateForm(form) {
  const fields = [...form.querySelectorAll('input, select, textarea')]
    .filter((field) => field.type !== 'hidden' && field.name !== '_honey');

  let firstInvalid = null;

  fields.forEach((field) => {
    clearFieldError(field);
    if (!field.checkValidity()) {
      showFieldError(field);
      if (!firstInvalid) firstInvalid = field;
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
    if (!firstInvalid) firstInvalid = field;
  });
  firstInvalid?.focus({ preventScroll: false });
}

function buildSubmissionPayload(form) {
  const payload = new FormData(form);
  const visitorEmail = payload.get('email');

  payload.set('_subject', 'Portfolio inquiry from nischhalsubba.com.np');
  payload.set('_template', 'table');
  payload.delete('_captcha');

  if (visitorEmail) payload.set('_replyto', visitorEmail);

  payload.set('source_page', window.location.href);
  payload.set('submitted_at', new Date().toISOString());
  return payload;
}

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  const existing = document.querySelector(`script[src^="${TURNSTILE_SCRIPT.split('?')[0]}"]`);
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
  const siteKey = form.dataset.turnstileSiteKey || document.querySelector('meta[name="turnstile-site-key"]')?.content?.trim();
  if (!siteKey) return { configured: false, widgetId: null };

  const actions = form.querySelector('.nrs-contact-form-actions');
  const host = document.createElement('div');
  host.className = 'nrs-turnstile';
  host.setAttribute('aria-label', 'Anti-spam verification');
  actions?.before(host);

  try {
    await loadTurnstileScript();
    const widgetId = window.turnstile.render(host, {
      sitekey: siteKey,
      theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
      'response-field-name': 'cf-turnstile-response',
    });
    return { configured: true, widgetId };
  } catch (error) {
    console.error('[portfolio] Turnstile could not initialize', error);
    setStatus('The protected form could not initialize. You can still use the email option.', 'error');
    return { configured: false, widgetId: null };
  }
}

export function initContactForm() {
  const form = $('#contact-form');
  if (!form || form.dataset.contactFormReady === 'true') return;

  form.dataset.contactFormReady = 'true';
  form.noValidate = true;
  form.setAttribute('action', `https://formsubmit.co/${CONTACT_EMAIL}`);
  form.setAttribute('method', 'POST');

  const status = $('#contact-form-status') || form.querySelector('[role="status"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const emailFallback = form.querySelector('a[href^="mailto:"]');
  const originalButtonText = submitButton?.textContent || 'Send message';

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

  emailFallback?.addEventListener('click', () => {
    setStatus('Opening your email app. Your form entries remain on this page.', 'neutral');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      setStatus('Review the highlighted fields and try again.', 'error');
      return;
    }

    const turnstile = await turnstileState;
    const token = form.querySelector('[name="cf-turnstile-response"]')?.value;
    if (turnstile.configured && !token) {
      setStatus('Complete the anti-spam check and try again.', 'error');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    form.setAttribute('aria-busy', 'true');
    setStatus(turnstile.configured ? 'Sending your message through the protected contact endpoint...' : 'Sending your message securely through the form provider...', 'neutral');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(turnstile.configured ? FIRST_PARTY_ENDPOINT : FALLBACK_ENDPOINT, {
        method: 'POST',
        body: buildSubmissionPayload(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result.errors) applyServerErrors(form, result.errors);
        throw new Error(result.message || `Form endpoint returned ${response.status}`);
      }

      form.reset();
      form.querySelectorAll('[aria-invalid="true"]').forEach(clearFieldError);
      if (turnstile.configured && window.turnstile && turnstile.widgetId !== null) window.turnstile.reset(turnstile.widgetId);
      setStatus(result.message || 'Thanks. Your message was sent successfully.', 'success');
    } catch (error) {
      console.error('[portfolio] contact form submission failed', error);
      const message = error?.name === 'AbortError'
        ? 'The message service took too long to respond. Your entries are still here; use the email button or try again.'
        : error.message || 'The direct form could not send your message. Your entries are still here; use the email button to send them manually.';
      setStatus(message, 'error');
      emailFallback?.focus({ preventScroll: false });
    } finally {
      window.clearTimeout(timeoutId);
      form.removeAttribute('aria-busy');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
