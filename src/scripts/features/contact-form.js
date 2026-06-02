import { $ } from '../utils/dom.js';

export function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const status = $('#contact-form-status') || form.querySelector('[role="status"]');
  const button = form.querySelector('button[type="submit"], button');
  const originalButtonText = button?.textContent || 'Submit message';
  const setStatus = (message, tone = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"], button');
    const hasExternalAction = /^https?:\/\//.test(form.getAttribute('action') || '');

    if (button) {
      button.disabled = true;
      button.textContent = hasExternalAction ? 'Sending...' : 'Opening email...';
    }
    setStatus('Sending your message...', 'neutral');

    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    if (hasExternalAction) {
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error(`FormSubmit returned ${response.status}`);

        form.reset();
        setStatus('Thanks. Your message was sent, and I will reply by email.', 'success');
      } catch (error) {
        setStatus('The form could not send without leaving the page. Email me directly at hinischalsubba@gmail.com.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalButtonText;
        }
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`);
    window.location.href = `mailto:hinischalsubba@gmail.com?subject=${subject}&body=${body}`;
    if (button) {
      button.disabled = false;
      button.textContent = originalButtonText;
    }
  });
}
