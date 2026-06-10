import { $ } from '../utils/dom.js';

const CONTACT_EMAIL = 'hinischalsubba@gmail.com';

function encodeEmailBody(form) {
  const data = new FormData(form);
  const name = data.get('name') || '';
  const email = data.get('email') || '';
  const need = data.get('need') || '';
  const message = data.get('message') || '';

  return {
    subject: encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`),
    body: encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Need: ${need}`,
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

export function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

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

    const hasExternalAction = /^https?:\/\//.test(form.getAttribute('action') || '');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = hasExternalAction ? 'Sending...' : 'Opening email...';
    }

    setStatus('Sending your message...', 'neutral');

    if (!hasExternalAction) {
      openEmailFallback(form);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
      setStatus('Your email app should open with the message filled in.', 'success');
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error(`FormSubmit returned ${response.status}`);

      form.reset();
      setStatus('Thanks. Your message was sent successfully.', 'success');
    } catch (error) {
      setStatus('The direct form send was blocked. Opening your email app instead.', 'error');
      openEmailFallback(form);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
