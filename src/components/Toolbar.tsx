'use client';

import { memo, type ReactNode } from 'react';
import type { ToolbarRenderProps } from '../types';
import { useLightboxContext } from '../context/LightboxContext';
import { supportsTransform, resolveMediaType } from '../utils/fileDetection';

export interface ToolbarProps {
  renderToolbar?: (props: ToolbarRenderProps) => ReactNode;
}

function ToolbarComponent({ renderToolbar }: ToolbarProps) {
  const ctx = useLightboxContext();
  const { item, index, total, transform, isFullscreen, icons } = ctx;

  if (!item || !ctx.showToolbar) return null;

  const toolbarProps: ToolbarRenderProps = {
    item,
    index,
    total,
    zoom: transform.zoom,
    rotate: transform.rotate,
    isFullscreen,
    onClose: ctx.onClose,
    onPrev: ctx.onPrev,
    onNext: ctx.onNext,
    onZoomIn: ctx.onZoomIn,
    onZoomOut: ctx.onZoomOut,
    onRotateLeft: ctx.onRotateLeft,
    onRotateRight: ctx.onRotateRight,
    onReset: ctx.onReset,
    onDownload: ctx.onDownload,
    onToggleFullscreen: ctx.onToggleFullscreen,
  };

  if (renderToolbar) {
    return <div className="lbjs-toolbar">{renderToolbar(toolbarProps)}</div>;
  }

  const mediaType = resolveMediaType(item.src, item.type);
  const canTransform = supportsTransform(mediaType);
  const canDownload = item.download !== false && ctx.showDownload;
  const title = item.title ?? '';

  return (
    <header className="lbjs-toolbar" onClick={(e) => e.stopPropagation()}>
      <div className="lbjs-toolbar-start">
        {title && (
          <div className="lbjs-title">
            <span className="lbjs-title-text">{title}</span>
            {item.description && (
              <span className="lbjs-title-desc">{item.description}</span>
            )}
          </div>
        )}
        {total > 1 && (
          <span className="lbjs-counter" aria-hidden="true">
            {index + 1} / {total}
          </span>
        )}
      </div>

      <div className="lbjs-toolbar-actions" role="toolbar" aria-label="Lightbox controls">
        {canTransform && ctx.showZoom && (
          <>
            <button
              type="button"
              className="lbjs-icon-btn"
              onClick={ctx.onZoomIn}
              aria-label="Zoom in"
            >
              {icons.zoomIn}
            </button>
            <button
              type="button"
              className="lbjs-icon-btn"
              onClick={ctx.onZoomOut}
              aria-label="Zoom out"
            >
              {icons.zoomOut}
            </button>
          </>
        )}

        {canTransform && mediaType === 'image' && ctx.showRotate && (
          <>
            <button
              type="button"
              className="lbjs-icon-btn"
              onClick={ctx.onRotateLeft}
              aria-label="Rotate left"
            >
              {icons.rotateLeft}
            </button>
            <button
              type="button"
              className="lbjs-icon-btn"
              onClick={ctx.onRotateRight}
              aria-label="Rotate right"
            >
              {icons.rotateRight}
            </button>
          </>
        )}

        {canTransform && (
          <button
            type="button"
            className="lbjs-icon-btn"
            onClick={ctx.onReset}
            aria-label="Reset view"
          >
            {icons.reset}
          </button>
        )}

        {canDownload && (
          <button
            type="button"
            className="lbjs-icon-btn"
            onClick={ctx.onDownload}
            aria-label="Download"
          >
            {icons.download}
          </button>
        )}

        {ctx.showFullscreen && (
          <button
            type="button"
            className="lbjs-icon-btn"
            onClick={ctx.onToggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? icons.fullscreenExit : icons.fullscreen}
          </button>
        )}

        <button
          type="button"
          className="lbjs-icon-btn"
          onClick={ctx.onClose}
          aria-label="Close lightbox"
        >
          {icons.close}
        </button>
      </div>
    </header>
  );
}

export const Toolbar = memo(ToolbarComponent);
