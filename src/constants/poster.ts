import { NavItem } from '../types';

export const FRONT_LILY_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85';

export const REVEAL_LILY_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85';

export const NAV_ITEMS: NavItem[] = [
  { id: 'nav-home', label: 'Home', href: '#home', leftDesktop: '10.104167vw', scaleX: 1.165 },
  { id: 'nav-resources', label: 'Resources', href: '#resources', leftDesktop: '17.526042vw', scaleX: 1.052 },
  { id: 'nav-benefits', label: 'Benefits', href: '#benefits', leftDesktop: '27.578125vw', scaleX: 1.126 },
  { id: 'nav-contact', label: 'Contact', href: '#contact', leftDesktop: '36.171875vw', scaleX: 1.168 },
];

export const TRAIL_CONSTANTS = {
  TRAIL_MAX_POINTS: 60,
  TRAIL_HEAD_R: 140,
  TRAIL_NOISE_AMP: 44,
  TRAIL_BLOB_PTS: 24,
  TRAIL_FADE_SPEED: 0.92,
  TRAIL_SAMPLE_DIST: 8,
} as const;

export const COPY = {
  left: 'Every workflow,\nintelligently connected.',
  right: 'Less manual work.\nMore meaningful output.',
  pill: 'Secure system',
};
