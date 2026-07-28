import React, { useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeGeneratorProps {
  carnetId: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ carnetId }) => {
  const [copied, setCopied] = useState(false);

  // Generate verification URL from carnet ID
  const verificationUrl = `${window.location.origin}/carnet/${carnetId}/verificar`;

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }, [verificationUrl]);

  const handleDownloadQR = useCallback(() => {
    // Get the SVG element and convert to PNG
    const svg = document.querySelector('svg');
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `carnet-${carnetId}.png`;
        link.click();
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  }, [carnetId]);

  return (
    <div className="flex flex-col items-center gap-md">
      {/* QR Code - Responsive sizes (200px on mobile, 300px on desktop) */}
      <div className="p-sm bg-white rounded-md border border-neutral-300 shadow-sm flex justify-center">
        {/* Mobile QR Code: 200px x 200px (hidden on md+) */}
        <div className="block md:hidden">
          <QRCodeSVG
            value={verificationUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Desktop QR Code: 300px x 300px (hidden on sm) */}
        <div className="hidden md:block">
          <QRCodeSVG
            value={verificationUrl}
            size={300}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Verification URL */}
      <div className="w-full">
        <p className="text-caption text-neutral-500 mb-xs text-center">
          Código de verificación
        </p>
        <div className="flex items-center gap-xs bg-neutral-100 rounded-md px-sm py-xs">
          <span className="text-caption text-neutral-700 flex-1 truncate">
            {carnetId}
          </span>
          <button
            onClick={handleCopyToClipboard}
            className="flex-shrink-0 p-xs hover:opacity-70 transition-opacity"
            aria-label="Copy verification URL"
          >
            {copied ? (
              <Check size={16} className="text-success" />
            ) : (
              <Copy size={16} className="text-neutral-500" />
            )}
          </button>
        </div>
      </div>

      {/* Download Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadQR}
        className="w-full"
      >
        Descargar código QR
      </Button>
    </div>
  );
};
