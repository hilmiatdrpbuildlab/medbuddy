import QR from 'qrcode/lib/core/qrcode';

/** QR code as an SVG string, for the printable PDF. */
export function qrSvg(text: string, color = '#14202A') {
  const { size, data } = QR.create(text, { errorCorrectionLevel: 'L' }).modules;
  let d = '';
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (data[y * size + x]) d += `M${x + 2},${y + 2}h1v1h-1z`;
  const n = size + 4;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="${color}"/></svg>`;
}
