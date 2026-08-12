/**
 * @fileoverview src/scripts/features/forms/contact-form.js
 * Purpose: Implement contact form behavior inside the forms browser-runtime domain.
 * Responsibilities:
 * - Own the forms behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $ } from '../../shared/dom.js';

const CONTACT_EMAIL = 'hinischalsubba@gmail.com';
const FIRST_PARTY_ENDPOINT = '/api/contact';
const FALLBACK_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const REQUEST_TIMEOUT_MS = 20000;



/**
 * Function contract: errorId
 * Purpose: Implement the error id responsibility owned by the contact form browser feature.
 * Inputs: `field`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function errorId(field) {
  const name = (field.name || field.id || 'field').replace(/[^a-z0-9_-]/gi, '-');
  return `contact-error-${name}`;
}



/**
 * Function contract: validationMessage
 * Purpose: Implement the validation message responsibility owned by the contact form browser feature.
 * Inputs: `field`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Implement the clear field error responsibility owned by the contact form browser feature.
 * Inputs: `field`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  const id = errorId(field);
  document.getElementById(id)?.remove();
  const values = (field.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `value` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (value) => value !== id);
  if (values.length) field.setAttribute('aria-describedby', values.join(' '));
  else field.removeAttribute('aria-describedby');
}



/**
 * Function contract: showFieldError
 * Purpose: Implement the show field error responsibility owned by the contact form browser feature.
 * Inputs: `field`, `message`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Determine whether restore invalid focus satisfies the condition represented by this contact form browser feature.
 * Inputs: `field`
 * Side effects: reads or updates DOM/browser state
 * Returns: Boolean indicating whether restore invalid focus satisfies the documented condition.
 */
function canRestoreInvalidFocus(field) {
  const active = document.activeElement;
  if (!active || active === document.body || active === document.documentElement) return true;
  if (active === field) return false;
  return active instanceof HTMLIFrameElement && Boolean(active.closest('.nrs-turnstile'));
}



/**
 * Function contract: focusInvalid
 * Purpose: Implement the focus invalid responsibility owned by the contact form browser feature.
 * Inputs: `field`, `{ persistent = false }`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function focusInvalid(field, { persistent = false } = {}) {
  if (!field) return;

  
  
  /**
   * Function contract: restore
   * Purpose: Apply module behavior consistently while preserving the surrounding contact form browser feature contract.
   * Inputs: `force`
   * Side effects: reads or updates DOM/browser state
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
   */
  const restore = (force = false) => {
    if (!field.isConnected || document.activeElement === field) return;
    if (!force && !canRestoreInvalidFocus(field)) return;
    field.focus({ preventScroll: false });
  };

  restore(true);
  queueMicrotask(   /** Callback contract: Perform the local callback step required by the immediately enclosing contact form browser feature operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ () => restore());
  requestAnimationFrame(   /** Callback contract: Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
    restore();
    window.setTimeout(   /** Callback contract: Perform the local callback step required by the immediately enclosing contact form browser feature operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ () => restore(), 0);
  });

  if (persistent) {
    const deadline = performance.now() + 1800;
    
    
    /**
     * Function contract: keepRestoring
     * Purpose: Implement the keep restoring responsibility owned by the contact form browser feature.
     * Inputs: None; derives required state from its enclosing module/runtime context.
     * Side effects: reads or updates DOM/browser state
     * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Validate module behavior and surface actionable failures when the contact form browser feature contract is violated.
 * Inputs: `form`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function validate(form) {
  let firstInvalid = null;
  [...form.querySelectorAll('input, select, textarea')]
    .filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `field` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (field) => field.type !== 'hidden' && field.name !== '_honey')
    .forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `field` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (field) => {
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
 * Purpose: Apply server errors consistently while preserving the surrounding contact form browser feature contract.
 * Inputs: `form`, `errors`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function applyServerErrors(form, errors = {}) {
  let firstInvalid = null;
  Object.entries(errors).forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `[name, message]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ ([name, message]) => {
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLElement)) return;
    showFieldError(field, String(message));
    firstInvalid ||= field;
  });
  focusInvalid(firstInvalid, { persistent: true });
}



/**
 * Function contract: buildPayload
 * Purpose: Build payload from the supplied inputs in the form expected by downstream contact form browser feature consumers.
 * Inputs: `form`
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Return turnstile from the supplied inputs or current contact form browser feature state.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: registers or removes browser listeners; reads or updates DOM/browser state
 * Returns: The requested turnstile; explicit early-return branches define empty/fallback behavior.
 */
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  const base = TURNSTILE_SCRIPT.split('?')[0];
  const existing = document.querySelector(`script[src^="${base}"]`);
  if (existing) {
    return new Promise(   /** Callback contract: Perform the local callback step required by the immediately enclosing contact form browser feature operation. Inputs: `resolve`, `reject` Side effects: registers or removes browser listeners Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ (resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  return new Promise(   /** Callback contract: Perform the local callback step required by the immediately enclosing contact form browser feature operation. Inputs: `resolve`, `reject` Side effects: registers or removes browser listeners; reads or updates DOM/browser state Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ (resolve, reject) => {
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
 * Purpose: Initialize turnstile for the contact form browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: `form`
 * Side effects: reads or updates DOM/browser state; emits diagnostics or changes process failure state
 * Returns: Promise resolving to the computed function result.
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
 * Purpose: Implement the send payload responsibility owned by the contact form browser feature.
 * Inputs: `endpoint`, `form`, `signal`
 * Side effects: performs network I/O
 * Returns: Promise resolving to the computed function result.
 */
async function sendPayload(endpoint, form, signal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    body: buildPayload(form),
    headers: { Accept: 'application/json' },
    signal,
  });
  const result = await response.json().catch(   /** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ () => ({}));
  return { response, result };
}



/**
 * Function contract: initContactForm
 * Purpose: Initialize contact form for the contact form browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: registers or removes browser listeners; reads or updates DOM/browser state; emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
   * Purpose: Synchronize status with the requested state while preserving related contact form browser feature invariants.
   * Inputs: `message`, `tone`
   * Side effects: reads or updates DOM/browser state
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
   */
  const setStatus = (message, tone = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  const turnstileState = initializeTurnstile(form);
  form.querySelectorAll('input, select, textarea').forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `field` Side effects: registers or removes browser listeners Returns: Undefined; this callback is side-effect-only. */ (field) => {
    if (field.type === 'hidden') return;
    field.addEventListener('input',    /** Callback contract: Handle the input event for `field` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => clearFieldError(field));
    field.addEventListener('change',    /** Callback contract: Handle the change event for `field` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => clearFieldError(field));
  });
  emailLink?.addEventListener('click',    /** Callback contract: Handle the click event for `emailLink` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => setStatus('Opening your email app. Nothing you typed here has been cleared.', 'neutral'));

  form.addEventListener('submit',    /** Callback contract: Handle the submit event for `form` and apply the related local state update. Inputs: `event` Side effects: reads or updates DOM/browser state; emits diagnostics or changes process failure state Returns: Undefined; this callback is side-effect-only. */ async (event) => {
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
    const timeout = window.setTimeout(   /** Callback contract: Perform the local callback step required by the immediately enclosing contact form browser feature operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ () => controller.abort(), REQUEST_TIMEOUT_MS);

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
