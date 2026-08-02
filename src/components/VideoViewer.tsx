'use client';

import { memo, useCallback, useState, type ReactNode } from 'react';
import type { LightboxItem } from '../types';
import { createLightboxError, type LightboxError } from '../utils/errorHandler';
import { Loading } from './Loading';

export interface VideoViewerProps {
  item: LightboxItem;
  onError: (error: LightboxError) => void;
  renderLoading?: () => ReactNode;
  renderError?: (error: LightboxError) => ReactNode;
}

function VideoViewerComponent({
  item,
  onError,
  renderLoading,
  renderError,
}: VideoViewerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<LightboxError | null>(null);

  const handleError = useCallback(() => {
    const err = createLightboxError('LOAD_FAILED', `Failed to load video: ${item.src}`);
    setLoadError(err);
    setStatus('error');
    onError(err);
  }, [item.src, onError]);

  if (status === 'error' && loadError) {
    return (
      <div className="lbjs-viewer lbjs-viewer-video">
        {renderError ? renderError(loadError) : null}
      </div>
    );
  }

  return (
    <div className="lbjs-viewer lbjs-viewer-video">
      {status === 'loading' && (
        <div className="lbjs-viewer-overlay">{renderLoading ? renderLoading() : <Loading />}</div>
      )}
      <video
        className="lbjs-video"
        src={item.src}
        controls
        playsInline
        preload="metadata"
        onLoadedData={() => setStatus('ready')}
        onError={handleError}
        aria-label={item.title ?? 'Video'}
      >
        <track kind="captions" />
      </video>
    </div>
  );
}

export const VideoViewer = memo(VideoViewerComponent);
