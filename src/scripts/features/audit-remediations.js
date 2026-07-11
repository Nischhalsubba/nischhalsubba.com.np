const FIGMA_HOSTS = new Set(['www.figma.com', 'figma.com', 'embed.figma.com']);

const SERVICE_PATHS = new Set([
  '/services',
  '/product-design-nepal',
  '/web3-ux-designer',
  '/saas-ux-designer',
  '/website-ux-design',
  '/figma-design-systems',
  '/ux-audit',
]);

function getCanonicalPathname() {
  const pathname = window.location.pathname || '/';
