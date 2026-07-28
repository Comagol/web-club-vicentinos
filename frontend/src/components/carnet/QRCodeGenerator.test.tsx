import { render, screen } from '@testing-library/react';
import { QRCodeGenerator } from './QRCodeGenerator';
import { describe, it, expect } from 'vitest';

describe('QRCodeGenerator', () => {
  it('renders QR code component', () => {
    render(<QRCodeGenerator carnetId="carnet-123" />);

    expect(screen.getByText(/Código de verificación/i)).toBeInTheDocument();
  });

  it('displays verification URL', () => {
    render(<QRCodeGenerator carnetId="carnet-123" />);

    const urlText = screen.getByText('carnet-123');
    expect(urlText).toBeInTheDocument();
  });

  it('has download QR button', () => {
    render(<QRCodeGenerator carnetId="carnet-123" />);

    const downloadButton = screen.getByRole('button', { name: /Descargar código QR/i });
    expect(downloadButton).toBeInTheDocument();
  });
});
