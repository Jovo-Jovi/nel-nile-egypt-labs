// The published hotline is a short code such as the laboratory's own
// line. A tel: link opens the phone dialer on a mobile device. A value
// that is not a short digit code stays plain text.

export function buildHotlineHref(hotline: string | null): string | null {
  if (hotline === null) return null;
  const compact = hotline.replace(/[\s-]/g, "");
  if (!/^\d{3,6}$/.test(compact)) return null;
  return `tel:${compact}`;
}
