'use client';

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import type { LightboxItem, MediaTransform } from '../types';
import { createTransformStyle } from '../hooks/useMediaTransform';
import { usePinchZoom } from '../hooks/usePinchZoom';
import { createLightboxError, type LightboxError } from '../utils/errorHandler';
import { Loading } from './Loading';

export interface ImageViewerProps {
  item: LightboxItem;
  transform: MediaTransform;
  minZoom: number;
  maxZoom: number;
  onZoomChange: (zoom: number) => void;
  onPan: (x: number, y: number) => void;
  onError: (error: LightboxError) => void;
  renderLoading?: () => ReactNode;
  renderError?: (error: LightboxError) => ReactNode;
}

function ImageViewerComponent({
  item,
  transform,
  minZoom,
  maxZoom,
  onZoomChange,
  onPan,
  onError,
  renderLoading,
  renderError,
}: ImageViewerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<LightboxError | null>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setStatus('loading');
    setLoadError(null);
  }, [item.src]);

  const pinch = usePinchZoom({
    zoom: transform.zoom,
    minZoom,
    maxZoom,
    onZoomChange,
    enabled: true,
  });

  const handleLoad = useCallback(() => {
    setStatus('ready');
  }, []);

  const handleError = useCallback(() => {
    const err = createLightboxError('LOAD_FAILED', `Failed to load image: ${item.src}`);
    setLoadError(err);
    setStatus('error');
    onError(err);
  }, [item.src, onError]);

  const handleDoubleClick = useCallback(() => {
    if (transform.zoom > minZoom) {
      onZoomChange(minZoom);
      onPan(0, 0);
    } else {
      onZoomChange(Math.min(maxZoom, 2.5));
    }
  }, [transform.zoom, minZoom, maxZoom, onZoomChange, onPan]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pinch.onPointerDown(event);
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (transform.zoom <= minZoom) return;
      dragging.current = true;
      lastPos.current = { x: event.clientX, y: event.clientY };
      panStart.current = { x: transform.x, y: transform.y };
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    },
    [pinch, transform.zoom, transform.x, transform.y, minZoom],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pinch.onPointerMove(event);
      if (!dragging.current) return;
      const dx = event.clientX - lastPos.current.x;
      const dy = event.clientY - lastPos.current.y;
      onPan(panStart.current.x + dx, panStart.current.y + dy);
    },
    [pinch, onPan],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pinch.onPointerUp(event);
      dragging.current = false;
    },
    [pinch],
  );

  if (status === 'error' && loadError) {
    return (
      <div className="lbjs-viewer lbjs-viewer-image">
        {renderError ? renderError(loadError) : null}
      </div>
    );
  }

  return (
    <div
      className="lbjs-viewer lbjs-viewer-image"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {status === 'loading' && (
        <div className="lbjs-viewer-overlay">{renderLoading ? renderLoading() : <Loading />}</div>
      )}
      <img
        className="lbjs-image"
        src={item.src}
        alt={item.alt ?? item.title ?? 'Lightbox image'}
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          transform: createTransformStyle(transform),
          cursor: transform.zoom > minZoom ? 'grab' : 'default',
          opacity: status === 'loading' ? 0 : 1,
        }}
      />
    </div>
  );
}

export const ImageViewer = memo(ImageViewerComponent);
