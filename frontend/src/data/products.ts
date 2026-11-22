import { Product } from '../types';

export const SYNTHETIC_PRODUCTS: Product[] = [
  {
    id: 'prod-wireless-mouse',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless accessory with silent optical switches and precision 2.4GHz tracking.',
    pricePaise: 79900, // ₹799
    badge: 'Product 01',
    category: 'Hardware',
    features: ['2.4 GHz + Bluetooth Low Energy', 'Silent optical tactile switches', 'Up to 12-month battery life'],
    // Crisp SVG illustration matching Stripe/Linear hardware design language
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none"><rect width="160" height="160" rx="16" fill="%23F1F3F7"/><path d="M80 32C60 32 46 50 46 80C46 110 60 128 80 128C100 128 114 110 114 80C114 50 100 32 80 32Z" fill="%23171923"/><line x1="80" y1="32" x2="80" y2="68" stroke="%232A2F45" stroke-width="2"/><rect x="76" y="46" width="8" height="18" rx="4" fill="%235145CD"/><ellipse cx="80" cy="102" rx="12" ry="7" fill="%232A2F45"/></svg>',
  },
  {
    id: 'prod-mechanical-keyboard',
    name: 'Mechanical Keyboard',
    description: 'Compact mechanical keyboard featuring hot-swappable linear switches and PBT keycaps.',
    pricePaise: 199900, // ₹1,999
    badge: 'Product 02',
    category: 'Hardware',
    features: ['Hot-swappable red linear switches', 'Double-shot PBT sound-dampened keycaps', 'Detachable braided USB-C cable'],
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none"><rect width="160" height="160" rx="16" fill="%23F1F3F7"/><rect x="22" y="46" width="116" height="68" rx="10" fill="%23171923"/><rect x="28" y="52" width="104" height="56" rx="6" fill="%232A2F45"/><circle cx="38" cy="62" r="3.5" fill="%235145CD"/><circle cx="50" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="62" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="74" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="86" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="98" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="110" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="122" cy="62" r="3.5" fill="%23E6E8EF"/><circle cx="38" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="50" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="62" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="74" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="86" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="98" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="110" cy="74" r="3.5" fill="%23E6E8EF"/><circle cx="122" cy="74" r="3.5" fill="%23E6E8EF"/><rect x="56" y="93" width="48" height="6" rx="2" fill="%235145CD"/></svg>',
  },
];
