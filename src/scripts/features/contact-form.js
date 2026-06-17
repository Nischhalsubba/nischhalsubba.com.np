import { $ } from '../utils/dom.js';

const CONTACT_EMAIL = 'hinischalsubba@gmail.com';
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

function encodeEmailBody(form) {
  const data = new FormData(form);
  const name = data.get('name') || '';
  const email = data.get('email') || '';
  const need = data.get('need') || '';
  const timeline = data.get('timeline') || '';
  const message = data.get('message') || '';

  return {
    subject: encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`),
    body: encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${need}`,
        `Timeline: ${timeline}`,
        '',
        'Project brief:',
        message,
      ].join('\n')
    ),
  };
}

function openEmailFallback(form) {
  const { subject, body } = encodeEmailBody(form);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function buildSubmissionPayload(form) {
  const payload = new FormData(form);
  const visitorEmail = payload.get('email');

  payload.set('_subject', 'Portfolio inquiry from nischhalsubba.com.np');
  payload.set('_template', 'table');
  payload.set('_captcha', 'false');

  if (visitorEmail) {
    payload.set('_replyto', visitorEmail);
  }

  payload.set('source_page', window.location.href);
  payload.set('submitted_at', new Date().toISOString());

  return payload;
}

export function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.setAttribute('action', `https://formsubmit.co/${CONTACT_EMAIL}`);
  form.setAttribute('method', 'POST');

  const status = $('#contact-form-status') || form.querySelector('[role="status"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const emailFallback = form.querySelector('a[href^="mailto:"]');
  const originalButtonText = submitButton?.textContent || 'Submit message';

  const setStatus = (message, tone = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  emailFallback?.addEventListener('click', () => {
    setStatus('Opening your email app with the message context.', 'neutral');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      setStatus('Please fill the required fields first.', 'error');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    setStatus('Sending your message to hinischalsubba@gmail.com...', 'neutral');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        body: buildSubmissionPayload(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Form endpoint returned ${response.status}`);
      }

      form.reset();
      setStatus('Thanks. Your message was sent to hinischalsubba@gmail.com.', 'success');
    } catch (error) {
      setStatus('Direct send was blocked. Opening your email app with the same message.', 'error');
      openEmailFallback(form);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
