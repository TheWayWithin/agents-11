'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from './button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from './toast';

interface DownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  libraryId: string;
  libraryName: string;
  children?: React.ReactNode;
}

export function DownloadButton({
  libraryId,
  libraryName,
  children,
  disabled,
  ...props
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/download/${libraryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initiate download');
      }

      const { download_url, filename } = await response.json();

      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = download_url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('success', `${libraryName} download started successfully!`);
    } catch (error) {
      console.error('Download failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      addToast('error', `Download failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          {!children && <Download className="h-4 w-4 mr-2" />}
          {children || 'Download'}
        </>
      )}
    </Button>
  );
}
