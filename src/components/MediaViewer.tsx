'use client';

import { memo, useEffect, useMemo, type ReactNode } from 'react';
import type { LightboxItem, MediaTransform } from '../types';
import { resolveMediaType } from '../utils/fileDetection';
import { validateSource } from '../utils/validation';
import { createLightboxError, type LightboxError } from '../utils/errorHandler';
import { ErrorDisplay } from './ErrorDisplay';
import { ImageViewer } from './ImageViewer';
import { PdfViewer } from './PdfViewer';
import { VideoViewer } from './VideoViewer';
import { AudioViewer } from './AudioViewer';
import { FileViewer } from './FileViewer';

export interface MediaViewerProps {
  item: LightboxItem;
  transform: MediaTransform;
  minZoom: number;
  maxZoom: number;
  showDownload?: boolean;
  onZoomChange: (zoom: number) => void;
  onPan: (x: number, y: number) => void;
  onError: (error: LightboxError) => void;
  onDownload?: (item: LightboxItem) => void;
  renderItem?: (item: LightboxItem, index: number) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: LightboxError) => ReactNode;
  index: number;
}

function MediaViewerComponent({
  item,
  transform,
  minZoom,
  maxZoom,
  showDownload,
  onZoomChange,
  onPan,
  onError,
  onDownload,
  renderItem,
  renderLoading,
  renderError,
  index,
}: MediaViewerProps) {
  const validationError = useMemo(() => validateSource(item.src), [item.src]);
  const type = useMemo(
    () => resolveMediaType(item.src, item.type),
    [item.src, item.type],
  );

  const notFoundError = useMemo(
    () => (!item.src ? createLightboxError('MEDIA_NOT_FOUND') : null),
    [item.src],
  );

  useEffect(() => {
    if (validationError) onError(validationError);
    else if (notFoundError) onError(notFoundError);
  }, [validationError, notFoundError, onError]);

  if (validationError) {
    return (
      <div className="lbjs-media">
        {renderError ? renderError(validationError) : <ErrorDisplay error={validationError} />}
      </div>
    );
  }

  if (notFoundError) {
    return (
      <div className="lbjs-media">
        {renderError ? renderError(notFoundError) : <ErrorDisplay error={notFoundError} />}
      </div>
    );
  }

  if (renderItem) {
    return <div className="lbjs-media">{renderItem(item, index)}</div>;
  }

  const errorFallback = (error: LightboxError) =>
    renderError ? renderError(error) : <ErrorDisplay error={error} />;

  let content: ReactNode;

  switch (type) {
    case 'image':
      content = (
        <ImageViewer
          item={item}
          transform={transform}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onZoomChange={onZoomChange}
          onPan={onPan}
          onError={onError}
          renderLoading={renderLoading}
          renderError={errorFallback}
        />
      );
      break;
    case 'pdf':
      content = (
        <PdfViewer
          item={item}
          transform={transform}
          onError={onError}
          renderLoading={renderLoading}
          renderError={errorFallback}
        />
      );
      break;
    case 'video':
      content = (
        <VideoViewer
          item={item}
          onError={onError}
          renderLoading={renderLoading}
          renderError={errorFallback}
        />
      );
      break;
    case 'audio':
      content = (
        <AudioViewer
          item={item}
          onError={onError}
          renderLoading={renderLoading}
          renderError={errorFallback}
        />
      );
      break;
    case 'file':
    default:
      content = (
        <FileViewer item={item} showDownload={showDownload} onDownload={onDownload} />
      );
      break;
  }

  return <div className="lbjs-media">{content}</div>;
}

export const MediaViewer = memo(MediaViewerComponent);
