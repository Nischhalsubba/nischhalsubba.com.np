import { $$ } from '../utils/dom.js';

export function initResumeDownload() {
  $$('a[href$="resume.pdf"], .floating-resume-btn').forEach((link) => {
    link.setAttribute('href', '/assets/resume.pdf');
    link.setAttribute('download', 'Nischhal-Raj-Subba-Resume.pdf');
  });
}
