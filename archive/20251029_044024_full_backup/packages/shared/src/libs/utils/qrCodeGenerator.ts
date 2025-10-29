
export class QRCodeGenerator {
  static async generateQR(url: string, options: {
    size?: number;
    color?: string;
    bgColor?: string;
  } = {}): Promise<string> {
    const { size = 256, color = '#000000', bgColor = '#ffffff' } = options;
    
    // Using qrcode library (you'll need to install it)
    // For now, using a simple data URL approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Simple QR placeholder (in production, use proper QR library)
    ctx.fillStyle = color;
    ctx.font = '12px monospace';
    ctx.fillText('QR Code', 10, size / 2);
    ctx.fillText(url.substring(0, 30), 10, size / 2 + 20);

    return canvas.toDataURL();
  }

  static async generateDeepLinkQR(params: {
    type: 'prediction' | 'match' | 'news' | 'leaderboard';
    id: string;
    title?: string;
  }): Promise<string> {
    const baseUrl = window.location.origin;
    const deepLink = `${baseUrl}/${params.type}/${params.id}`;
    
    return this.generateQR(deepLink, {
      size: 300,
      color: '#0f172a',
      bgColor: '#ffffff'
    });
  }
}
