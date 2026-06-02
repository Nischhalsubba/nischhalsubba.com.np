import { $ } from '../utils/dom.js';

export function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    const button = form.querySelector('button[type="submit"], button');
    const hasExternalAction = /^https?:\/\//.test(form.getAttribute('action') || '');

    if (button) button.textContent = hasExternalAction ? 'Submitting...' : 'Opening email...';

    if (hasExternalAction) return;

    event.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`);

    window.location.href = `mailto:hinischalsubba@gmail.com?subject=${subject}&body=${body}`;
  });
}
