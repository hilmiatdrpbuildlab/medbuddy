declare module 'qrcode/lib/core/qrcode' {
  const QR: { create(text: string, opts?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' }): { modules: { size: number; data: Uint8Array | boolean[] } } };
  export default QR;
}
