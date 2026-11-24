/**
 * Brand config — the only place the working name, colours and public URLs live.
 * Change these after the EUIPO/BOIP trademark check; every screen, the PDF and
 * the QR page read from here.
 */
export const brand = {
  name: 'VitalsBrief',
  /** Personal forwarding inbox domain shown on the "Forward by email" screen. */
  inboxDomain: 'in.vitalsbrief.be',
  /** Read-only GP Brief web page opened by the QR code (Cloudflare Pages). */
  briefBaseUrl: 'https://vitalsbrief-demo.pages.dev/b/',
  /** Validity of a shared brief link, in days. */
  briefLinkDays: 7,
  colors: {
    primary: '#0B5D63',
    primaryDark: '#5CC3C2',
    accent: '#C24E35',
    accentDark: '#F4A672',
  },
} as const;
