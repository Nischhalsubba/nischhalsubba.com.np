import { $$ } from '../utils/dom.js';

const RESUME_URL = '/assets/resume.pdf';
const RESUME_FILENAME = 'Nischhal-Raj-Subba-Resume.pdf';

export function initResumeDownload() {
  $$('a[href$="resume.pdf"], .floating-resume-btn, [data-resume-download]').forEach((link) => {
    link.setAttribute('href', RESUME_URL);
    link.setAttribute('download', RESUME_FILENAME);
    link.setAttribute('type', 'application/pdf');

    link.addEventListener('click', (event) => {
      event.preventDefault();

      const downloadLink = document.createElement('a');
      downloadLink.href = `${RESUME_URL}?download=1`;
      downloadLink.download = RESUME_FILENAME;
      downloadLink.rel = 'noopener';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    });
  });
}
