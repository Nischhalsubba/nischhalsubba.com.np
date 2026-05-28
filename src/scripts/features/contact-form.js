import { $ } from '../utils/dom.js';

export function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"], button');
    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`);

    if (button) button.textContent = 'Opening email...';
    window.location.href = `mailto:hinischalsubba@gmail.com?subject=${subject}&body=${body}`;
  });
}
