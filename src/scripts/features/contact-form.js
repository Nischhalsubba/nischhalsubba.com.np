import { $ } from '../utils/dom.js';

const CONTACT_EMAIL = 'hinischalsubba@gmail.com';
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

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

function showFieldError(field) {
  clearFieldError(field);

  const error = document.createElement('span');
  const errorId = getFieldErrorId(field);
  error.id = errorId;
  error.className = 'nrs-contact-field-error';
  error.textContent = getValidationMessage(field);

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

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your message securely through the form provider...', 'neutral');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        body: buildSubmissionPayload(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);

      form.reset();
      form.querySelectorAll('[aria-invalid="true"]').forEach(clearFieldError);
      setStatus('Thanks. Your message was sent successfully.', 'success');
    } catch (error) {
      console.error('[portfolio] contact form submission failed', error);
      setStatus('The direct form could not send your message. Your entries are still here; use the email button to send them manually.', 'error');
      emailFallback?.focus({ preventScroll: false });
    } finally {
      form.removeAttribute('aria-busy');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
