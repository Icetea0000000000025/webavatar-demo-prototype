export interface PageConfig {
  name: string;
  path: string;
  id: string;
  key: string;
  enabled: boolean;
}

export const pagesConfig: PageConfig[] = [
  { name: 'Home', path: '/', id: 'home', key: 'nav.home', enabled: true },
  { name: 'About Us', path: '/about', id: 'about', key: 'nav.about', enabled: true },
  { name: 'Events', path: '/event', id: 'event', key: 'nav.event', enabled: true },
  { name: 'Contact & FAQ', path: '/contact', id: 'contact', key: 'nav.contact', enabled: true },
  { name: 'AI Sales', path: '/ai-sales', id: 'ai-sales', key: 'nav.ai_sales', enabled: true },
  { name: 'Flight Demo', path: '/flight-demo', id: 'flight', key: 'nav.flight', enabled: true },
  { name: 'TN House Portal', path: '/all-demo', id: 'order', key: 'nav.order', enabled: true },
  { name: 'IT Store Demo', path: '/it-store-demo', id: 'itstore', key: 'nav.itstore', enabled: true },
  { name: 'SITE 2026', path: '/nia-site-2026', id: 'site2026', key: 'nav.site2026', enabled: false }, // Event has ended
];
