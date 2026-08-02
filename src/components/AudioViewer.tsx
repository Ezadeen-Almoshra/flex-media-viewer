'use client';

import { memo, useCallback, useState, type ReactNode } from 'react';
import type { LightboxItem } from '../types';
import { createLightboxError, type LightboxError } from '../utils/errorHandler';
import { Loading } from './Loading';

export interface AudioViewerProps {
  item: LightboxItem;
  onError: (error: LightboxError) => void;
  renderLoading?: () => ReactNode;
  renderError?: (error: LightboxError) => ReactNode;
}

function AudioViewerComponent({
  item,
  onError,
  renderLoading,
  renderError,
}: AudioViewerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<LightboxError | null>(null);

  const handleError = useCallback(() => {
    const err = createLightboxError('LOAD_FAILED', `Failed to load audio: ${item.src}`);
    setLoadError(err);
    setStatus('error');
    onError(err);
  }, [item.src, onError]);

  if (status === 'error' && loadError) {
    return (
      <div className="lbjs-viewer lbjs-viewer-audio">
        {renderError ? renderError(loadError) : null}
      </div>
    );
  }

  return (
    <div className="lbjs-viewer lbjs-viewer-audio">
      {status === 'loading' && (
        <div className="lbjs-viewer-overlay">{renderLoading ? renderLoading() : <Loading />}</div>
      )}
      <div className="lbjs-audio-card">
        {item.title && <h3 className="lbjs-audio-title">{item.title}</h3>}
        {item.description && <p className="lbjs-audio-desc">{item.description}</p>}
        <audio
          className="lbjs-audio"
          src={item.src}
          controls
          preload="metadata"
          onLoadedData={() => setStatus('ready')}
          onError={handleError}
          aria-label={item.title ?? 'Audio'}
        />
      </div>
    </div>
  );
}

export const AudioViewer = memo(AudioViewerComponent);
