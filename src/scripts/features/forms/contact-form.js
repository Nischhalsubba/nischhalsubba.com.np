/**
 * @fileoverview src/scripts/features/forms/contact-form.js
 * Purpose: Browser runtime feature in the forms domain responsible for contact form behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $ } from '../../shared/dom.js';

const CONTACT_EMAIL = 'hinischalsubba@gmail.com';
const FIRST_PARTY_ENDPOINT = '/api/contact';
const FALLBACK_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const REQUEST_TIMEOUT_MS = 20000;

/**
 * Function contract: errorId
 * Purpose: Implements the error id responsibility for this module.
 * Inputs: field.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function errorId(field) {
  const name = (field.name || field.id || 'field').replace(/[^a-z0-9_-]/gi, '-');
  return `contact-error-${name}`;
}

/**
 * Function contract: validationMessage
 * Purpose: Implements the validation message responsibility for this module.
 * Inputs: field.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function validationMessage(field) {
  if (field.validity.valueMissing) return 'Add this detail before sending.';
  if (field.validity.typeMismatch) return 'Use a valid email address.';
  if (field.validity.tooShort) return `Add a little more detail (at least ${field.minLength} characters).`;
  if (field.validity.tooLong) return `Keep this under ${field.maxLength} characters.`;
  return field.validationMessage || 'Check this field before sending.';
}

/**
 * Function contract: clearFieldError
 * Purpose: Implements the clear field error responsibility for this module.
 * Inputs: field.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  const id = errorId(field);
  document.getElementById(id)?.remove();
  const values = (field.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter(/** Callback contract: Processes the callback step for (field.get attribute('aria describedby') || '')
    .split(/\s+/)
    .filter(boolean) without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value) => value !== id);
  if (values.length) field.setAttribute('aria-describedby', values.join(' '));
  else field.removeAttribute('aria-describedby');
}

/**
 * Function contract: showFieldError
 * Purpose: Implements the show field error responsibility for this module.
 * Inputs: field, message.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
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

/**
 * Function contract: canRestoreInvalidFocus
 * Purpose: Implements the can restore invalid focus responsibility for this module.
 * Inputs: field.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function canRestoreInvalidFocus(field) {
  const active = document.activeElement;
  if (!active || active === document.body || active === document.documentElement) return true;
  if (active === field) return false;
  return active instanceof HTMLIFrameElement && Boolean(active.closest('.nrs-turnstile'));
}

/**
 * Function contract: focusInvalid
 * Purpose: Implements the focus invalid responsibility for this module.
 * Inputs: field, { persistent = false }.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function focusInvalid(field, { persistent = false } = {}) {
  if (!field) return;

  /**
   * Function contract: restore
   * Purpose: Implements the restore responsibility for this module.
   * Inputs: force.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  const restore = (force = false) => {
    if (!field.isConnected || document.activeElement === field) return;
    if (!force && !canRestoreInvalidFocus(field)) return;
    field.focus({ preventScroll: false });
  };

  restore(true);
  queueMicrotask(/** Callback contract: Processes the callback step for queue microtask without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => restore());
  requestAnimationFrame(/** Callback contract: Processes the callback step for request animation frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
    restore();
    window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => restore(), 0);
  });

  if (persistent) {
    const deadline = performance.now() + 1800;
    /**
     * Function contract: keepRestoring
     * Purpose: Implements the keep restoring responsibility for this module.
     * Inputs: none; the function derives state from its enclosing module/runtime context.
     * Side effects: may read or update browser DOM/state.
     * Returns: no explicit value unless an invoked dependency throws/rejects.
     */
    const keepRestoring = () => {
      restore();
      if (performance.now() < deadline) window.setTimeout(keepRestoring, 100);
    };
    window.setTimeout(keepRestoring, 100);
  }
}

/**
 * Function contract: validate
 * Purpose: Validates validate and reports violations instead of silently accepting invalid state.
 * Inputs: form.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function validate(form) {
  let firstInvalid = null;
  [...form.querySelectorAll('input, select, textarea')]
    .filter(/** Callback contract: Processes the callback step for [...form.query selector all('input, select, textarea')] without leaking orchestration details to the caller. Inputs: field. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (field) => field.type !== 'hidden' && field.name !== '_honey')
    .forEach(/** Callback contract: Processes the callback step for [...form.query selector all('input, select, textarea')]
    .filter((field) => field.type !== 'hidden' && field.name !== ' honey') without leaking orchestration details to the caller. Inputs: field. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (field) => {
      clearFieldError(field);
      if (!field.checkValidity()) {
        showFieldError(field);
        firstInvalid ||= field;
      }
    });
  focusInvalid(firstInvalid);
  return !firstInvalid;
}

/**
 * Function contract: applyServerErrors
 * Purpose: Applies apply server errors while preserving the surrounding repository/runtime contract.
 * Inputs: form, errors.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function applyServerErrors(form, errors = {}) {
  let firstInvalid = null;
  Object.entries(errors).forEach(/** Callback contract: Processes the callback step for object.entries(errors) without leaking orchestration details to the caller. Inputs: [name, message]. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ ([name, message]) => {
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLElement)) return;
    showFieldError(field, String(message));
    firstInvalid ||= field;
  });
  focusInvalid(firstInvalid, { persistent: true });
}

/**
 * Function contract: buildPayload
 * Purpose: Creates build payload from the supplied inputs and repository state.
 * Inputs: form.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function buildPayload(form) {
  const payload = new FormData(form);
  const visitorEmail = payload.get('email');

  payload.set('_subject', 'Portfolio inquiry from nischhalsubba.com.np');
  payload.set('_template', 'table');
  payload.set('_captcha', 'false');
  if (visitorEmail) payload.set('_replyto', visitorEmail);
  payload.set('source_page', window.location.href);
  payload.set('submitted_at', new Date().toISOString());
  return payload;
}

/**
 * Function contract: loadTurnstile
 * Purpose: Retrieves load turnstile and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  const base = TURNSTILE_SCRIPT.split('?')[0];
  const existing = document.querySelector(`script[src^="${base}"]`);
  if (existing) {
    return new Promise(/** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: resolve, reject. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  return new Promise(/** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: resolve, reject. Side effects: may read or update browser DOM/state. No explicit return contract. */ (resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

/**
 * Function contract: initializeTurnstile
 * Purpose: Implements the initialize turnstile responsibility for this module.
 * Inputs: form.
 * Side effects: may read or update browser DOM/state; may emit diagnostics or inspect process state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function initializeTurnstile(form) {
  const siteKey = form.dataset.turnstileSiteKey
    || document.querySelector('meta[name="turnstile-site-key"]')?.content?.trim();
  if (!siteKey) return { configured: false, ready: false, widgetId: null };

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
    });
    return { configured: true, ready: true, widgetId };
  } catch (error) {
    console.error('[portfolio] Turnstile initialization failed; using fallback delivery', error);
    host.remove();
    return { configured: true, ready: false, widgetId: null };
  }
}

/**
 * Function contract: sendPayload
 * Purpose: Implements the send payload responsibility for this module.
 * Inputs: endpoint, form, signal.
 * Side effects: may perform network I/O.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function sendPayload(endpoint, form, signal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    body: buildPayload(form),
    headers: { Accept: 'application/json' },
    signal,
  });
  const result = await response.json().catch(/** Callback contract: Processes the callback step for response.json() without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => ({}));
  return { response, result };
}

/**
 * Function contract: initContactForm
 * Purpose: Implements the init contact form responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state; may emit diagnostics or inspect process state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function initContactForm() {
  const form = $('#contact-form');
  if (!form || form.dataset.contactFormReady === 'true') return;

  form.dataset.contactFormReady = 'true';
  form.noValidate = true;
  form.action = FIRST_PARTY_ENDPOINT;
  form.method = 'POST';

  const status = $('#contact-form-status') || form.querySelector('[role="status"]');
  const submit = form.querySelector('button[type="submit"]');
  const emailLink = form.querySelector('a[href^="mailto:"]');
  const originalText = submit?.textContent || 'Send the context';
  /**
   * Function contract: setStatus
   * Purpose: Applies set status while preserving the surrounding repository/runtime contract.
   * Inputs: message, tone.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  const setStatus = (message, tone = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  const turnstileState = initializeTurnstile(form);
  form.querySelectorAll('input, select, textarea').forEach(/** Callback contract: Processes the callback step for form.query selector all('input, select, textarea') without leaking orchestration details to the caller. Inputs: field. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (field) => {
    if (field.type === 'hidden') return;
    field.addEventListener('input', /** Callback contract: Processes the callback step for field without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => clearFieldError(field));
    field.addEventListener('change', /** Callback contract: Processes the callback step for field without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => clearFieldError(field));
  });
  emailLink?.addEventListener('click', /** Callback contract: Processes the callback step for email link? without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => setStatus('Opening your email app. Nothing you typed here has been cleared.', 'neutral'));

  form.addEventListener('submit', /** Callback contract: Processes the callback step for form without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state; may emit diagnostics or inspect process state. Returns a value to the invoking API. */ async (event) => {
    event.preventDefault();
    if (!validate(form)) {
      setStatus('Review the highlighted fields, then send again.', 'error');
      focusInvalid(form.querySelector('[aria-invalid="true"]'), { persistent: true });
      return;
    }

    const turnstile = await turnstileState;
    const token = form.querySelector('[name="cf-turnstile-response"]')?.value;
    if (turnstile.ready && !token) {
      setStatus('Complete the anti-spam verification, then send again.', 'error');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your message…', 'neutral');

    let useFirstParty = Boolean(turnstile.ready && token);
    const controller = new AbortController();
    const timeout = window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      let { response, result } = await sendPayload(
        useFirstParty ? FIRST_PARTY_ENDPOINT : FALLBACK_ENDPOINT,
        form,
        controller.signal,
      );

      if (useFirstParty && response.status >= 500) {
        console.warn('[portfolio] protected contact endpoint unavailable; retrying through fallback delivery');
        useFirstParty = false;
        ({ response, result } = await sendPayload(FALLBACK_ENDPOINT, form, controller.signal));
      }

      if (!response.ok) {
        if (result.errors) applyServerErrors(form, result.errors);
        throw new Error(result.message || `The form returned ${response.status}.`);
      }

      form.reset();
      form.querySelectorAll('[aria-invalid="true"]').forEach(clearFieldError);
      if (window.turnstile && turnstile.widgetId !== null) window.turnstile.reset(turnstile.widgetId);
      setStatus(result.message || 'Thanks. Your message is on its way. I’ll reply as soon as I can.', 'success');
    } catch (error) {
      console.error('[portfolio] contact form submission failed', error);
      const message = error?.name === 'AbortError'
        ? 'This took too long to send. Your text is still here; try again or email me directly.'
        : error.message || 'I could not send this message. Your text is still here, and the email option is available.';
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
