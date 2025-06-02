
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simple QR code generation using canvas
    // In a real app, you'd use a library like 'qrcode'
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple placeholder QR code pattern
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 200, 200);
    
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 10, j * 10, 10, 10);
        }
      }
    }

    // Add corner squares
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 70, 70);
    ctx.fillRect(130, 0, 70, 70);
    ctx.fillRect(0, 130, 70, 70);

    ctx.fillStyle = '#fff';
    ctx.fillRect(10, 10, 50, 50);
    ctx.fillRect(140, 10, 50, 50);
    ctx.fillRect(10, 140, 50, 50);

    ctx.fillStyle = '#000';
    ctx.fillRect(20, 20, 30, 30);
    ctx.fillRect(150, 20, 30, 30);
    ctx.fillRect(20, 150, 30, 30);
  }, [url]);

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="border mx-auto mb-4"
        />
        <p className="text-sm text-gray-600">
          Scan this QR code to access the menu
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
