'use client';

import { memo, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { LightboxItem, MediaTransform } from '../types';
import { createTransformStyle } from '../hooks/useMediaTransform';
import { createLightboxError, type LightboxError } from '../utils/errorHandler';
import { Loading } from './Loading';

export interface PdfViewerProps {
  item: LightboxItem;
  transform: MediaTransform;
  onError: (error: LightboxError) => void;
  renderLoading?: () => ReactNode;
  renderError?: (error: LightboxError) => ReactNode;
}

function PdfViewerComponent({
  item,
  transform,
  onError,
  renderLoading,
  renderError,
}: PdfViewerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<LightboxError | null>(null);

  useEffect(() => {
    setStatus('loading');
    setLoadError(null);
    // Browser PDF viewers don't always fire load reliably; give a soft ready state
    const timer = window.setTimeout(() => setStatus('ready'), 400);
    return () => window.clearTimeout(timer);
  }, [item.src]);

  const handleError = useCallback(() => {
    const err = createLightboxError('LOAD_FAILED', `Failed to load PDF: ${item.src}`);
    setLoadError(err);
    setStatus('error');
    onError(err);
  }, [item.src, onError]);

  if (status === 'error' && loadError) {
    return (
      <div className="lbjs-viewer lbjs-viewer-pdf">
        {renderError ? renderError(loadError) : null}
      </div>
    );
  }

  return (
    <div className="lbjs-viewer lbjs-viewer-pdf">
      {status === 'loading' && (
        <div className="lbjs-viewer-overlay">{renderLoading ? renderLoading() : <Loading />}</div>
      )}
      <div
        className="lbjs-pdf-frame"
        style={{ transform: createTransformStyle({ ...transform, rotate: 0 }) }}
      >
        <iframe
          className="lbjs-pdf"
          src={item.src}
          title={item.title ?? 'PDF document'}
          onError={handleError}
        />
        <object
          className="lbjs-pdf-fallback"
          data={item.src}
          type="application/pdf"
          aria-label={item.title ?? 'PDF document'}
        >
          <p className="lbjs-pdf-unsupported">
            Unable to display PDF.{' '}
            <a href={item.src} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
          </p>
        </object>
      </div>
    </div>
  );
}

export const PdfViewer = memo(PdfViewerComponent);
