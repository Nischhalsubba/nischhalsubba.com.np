/*
 * Site polish layer.
 * Fixes scroll-filled outline headings and replaces machine-facing labels with human portfolio copy.
 */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function initOutlineHeadingFill() {
    const fills = Array.from(document.querySelectorAll('.text-reveal-wrap .text-fill'));
    if (!fills.length) return;

    if (reducedMotion) {
      fills.forEach((fill) => {
        fill.style.clipPath = 'inset(0 0% 0 0)';
        fill.style.webkitClipPath = 'inset(0 0% 0 0)';
      });
      return;
    }

    const update = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      fills.forEach((fill) => {
        const wrap = fill.closest('.text-reveal-wrap');
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const start = viewportHeight * 0.95;
        const end = viewportHeight * 0.25;
        const progress = clamp((start - rect.top) / (start - end), 0, 1);
        const hidden = Math.round((1 - progress) * 100);
        fill.style.clipPath = `inset(0 ${hidden}% 0 0)`;
        fill.style.webkitClipPath = `inset(0 ${hidden}% 0 0)`;
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    setTimeout(update, 250);
    setTimeout(update, 900);
  }

  function replaceAiSummaryWithPortfolioNote() {
    document.querySelectorAll('.nrs-ai-summary').forEach((section) => {
      section.classList.remove('nrs-ai-summary');
      section.classList.add('nrs-portfolio-note');
      const box = section.querySelector('div') || section;
      const path = window.location.pathname;
      const isProject = path.includes('/project-');
      const isBlog = path.includes('/blog/blog-');
      const isProjects = path.includes('/projects');
      const isAbout = path.includes('/about');

      let eyebrow = 'Portfolio note';
      let title = 'Built around real work, clear contribution, and practical design decisions.';
      let copy = 'This portfolio is written to show what I actually contributed: the design context, the constraints, the decisions, and the handoff details that shaped each project.';

      if (isProject) {
        eyebrow = 'Case study note';
        title = 'The focus here is the design work, not inflated claims.';
        copy = 'Each case study is framed around the real project context, my role, the UX decisions I worked through, and what can be shared publicly without exaggerating outcomes or exposing private details.';
      } else if (isBlog) {
        eyebrow = 'Writing note';
        title = 'A practical reflection from product design work.';
        copy = 'This article connects a specific design topic to real product situations, focusing on what makes interfaces clearer, easier to trust, and easier to build.';
      } else if (isProjects) {
        eyebrow = 'Work note';
        title = 'Projects are grouped by what I actually worked on.';
        copy = 'Some projects were led end-to-end, some were team contributions, and some were explorations. The goal is to make the role and scope clear before you open a case study.';
      } else if (isAbout) {
        eyebrow = 'About this practice';
        title = 'Designing with clarity, truthful framing, and implementation in mind.';
        copy = 'My work sits between product thinking, interface craft, content structure, and developer handoff. I care about making digital products easier to understand and easier to ship.';
      }

      box.innerHTML = `
        <p style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;margin-bottom:12px;">${eyebrow}</p>
        <h2 style="font-size:clamp(1.7rem,3vw,2.4rem);margin-bottom:14px;">${title}</h2>
        <p style="color:var(--text-secondary);line-height:1.8;margin:0;">${copy}</p>
      `;
    });
  }

  function addSmallPolishStyles() {
    if (document.getElementById('nrs-site-polish-styles')) return;
    const style = document.createElement('style');
    style.id = 'nrs-site-polish-styles';
    style.textContent = `
      .text-fill { will-change: clip-path; transition: clip-path .12s linear; }
      .nrs-portfolio-note { padding-top: clamp(64px, 8vw, 112px); padding-bottom: clamp(64px, 8vw, 112px); }
      .nrs-portfolio-note > div { box-shadow: 0 20px 80px rgba(0,0,0,.12); }
      @media (prefers-reduced-motion: reduce) { .text-fill { transition: none; } }
    `;
    document.head.appendChild(style);
  }

  function run() {
    addSmallPolishStyles();
    initOutlineHeadingFill();
    replaceAiSummaryWithPortfolioNote();
    setTimeout(replaceAiSummaryWithPortfolioNote, 100);
    setTimeout(replaceAiSummaryWithPortfolioNote, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
