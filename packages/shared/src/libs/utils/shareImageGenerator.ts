
export class ShareImageGenerator {
  static async generatePredictionImage(prediction: {
    match: string;
    confidence: number;
    prediction: string;
    sport: string;
  }): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add branding
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillText('Sports Central', 60, 80);

    // Match info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Inter, sans-serif';
    ctx.fillText(prediction.match, 60, 200);

    // Prediction
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 72px Inter, sans-serif';
    ctx.fillText(prediction.prediction, 60, 320);

    // Confidence
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '48px Inter, sans-serif';
    ctx.fillText(`${prediction.confidence}% Confidence`, 60, 420);

    // Sport icon/badge
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(60, 480, 200, 60);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText(prediction.sport.toUpperCase(), 80, 525);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
  }

  static async downloadImage(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async shareImage(blob: Blob, data: { title: string; text: string }) {
    const file = new File([blob], 'prediction.png', { type: 'image/png' });
    
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: data.title,
        text: data.text
      });
    } else {
      await this.downloadImage(blob, 'prediction.png');
    }
  }
}
