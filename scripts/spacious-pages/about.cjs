const { replaceMain, actions } = require('./shared.cjs');

const markup = `<main id="main-content" class="container nrs-spacious-page nrs-about-spacious">
  <section class="nrs-page-hero reveal-on-scroll" aria-labelledby="about-title">
    <div class="nrs-page-hero__title">
      <p class="eyebrow">About</p>
      <h1 id="about-title" class="hero-title">I design clear product experiences for complicated software.</h1>
      <p class="body-large">I am Nischhal Raj Subba, a Product Designer based in Nepal. I work across SaaS, Web3, fintech, mobile products, websites and design systems, usually where the product needs more structure before it needs more decoration.</p>
      ${actions}
    </div>
    <aside class="nrs-page-hero__aside" aria-label="Professional summary">
      <p class="nrs-aside-intro">My