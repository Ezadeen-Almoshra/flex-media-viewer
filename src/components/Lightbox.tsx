'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import type { LightboxIcons, LightboxProps } from '../types';
import { LightboxProvider, type LightboxContextValue } from '../context/LightboxContext';
import { useControlledIndex } from '../hooks/useLightbox';
import { useKeyboard } from '../hooks/useKeyboard';
import { useFullscreen } from '../hooks/useFullscreen';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useSwipe } from '../hooks/useSwipe';
import { useMediaTransform } from '../hooks/useMediaTransform';
import { downloadMedia } from '../utils/download';
import { createLightboxError, type LightboxError } from '../utils/errorHandler';
import { sanitizeFilename } from '../utils/validation';
import {
  CloseIcon,
  DownloadIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  NextIcon,
  PrevIcon,
  ResetIcon,
  RotateLeftIcon,
  RotateRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from './icons';
import { Overlay } from './Overlay';
import { Toolbar } from './Toolbar';
import { Navigation } from './Navigation';
import { MediaViewer } from './MediaViewer';
import { ErrorDisplay } from './ErrorDisplay';

const DEFAULT_ICONS: LightboxIcons = {
  close: <CloseIcon />,
  download: <DownloadIcon />,
  fullscreen: <FullscreenIcon />,
  fullscreenExit: <FullscreenExitIcon />,
  zoomIn: <ZoomInIcon />,
  zoomOut: <ZoomOutIcon />,
  rotateLeft: <RotateLeftIcon />,
  rotateRight: <RotateRightIcon />,
  prev: <PrevIcon />,
  next: <NextIcon />,
  reset: <ResetIcon />,
};

export function Lightbox({
  open,
  onClose,
  items,
  index: controlledIndex,
  defaultIndex = 0,
  onIndexChange,
  showToolbar = true,
  showDownload = true,
  showFullscreen = true,
  showZoom = true,
  showRotate = true,
  showNavigation = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  loop = true,
  animation = 'smooth',
  className,
  style,
  renderToolbar,
  renderItem,
  renderLoading,
  renderError,
  icons: iconOverrides,
  onError,
  onDownload,
  zoomStep = 0.25,
  maxZoom = 5,
  minZoom = 1,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useControlledIndex(controlledIndex, defaultIndex, onIndexChange);
  const {
    transform,
    zoomIn,
    zoomOut,
    setZoom,
    rotateLeft,
    rotateRight,
    reset,
    setPan,
  } = useMediaTransform({ zoomStep, minZoom, maxZoom });
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(dialogRef);

  const icons = useMemo(
    () => ({ ...DEFAULT_ICONS, ...iconOverrides }),
    [iconOverrides],
  );

  const total = items.length;
  const item = total > 0 ? (items[Math.min(Math.max(index, 0), total - 1)] ?? null) : null;

  // Reset transform when navigating
  useEffect(() => {
    reset();
  }, [index, reset]);

  // Exit fullscreen when closed
  useEffect(() => {
    if (!open) {
      void exitFullscreen();
    }
  }, [open, exitFullscreen]);

  useBodyScrollLock(open);
  useFocusTrap(dialogRef, open);

  const goPrev = useCallback(() => {
    if (total <= 0) return;
    if (index <= 0) {
      if (loop) setIndex(total - 1);
    } else {
      setIndex(index - 1);
    }
  }, [total, index, loop, setIndex]);

  const goNext = useCallback(() => {
    if (total <= 0) return;
    if (index >= total - 1) {
      if (loop) setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }, [total, index, loop, setIndex]);

  const handleError = useCallback(
    (error: LightboxError) => {
      onError?.(error);
    },
    [onError],
  );

  const handleDownload = useCallback(async () => {
    if (!item) return;
    if (onDownload) {
      onDownload(item);
      return;
    }
    try {
      await downloadMedia(item, sanitizeFilename(item.src, item.title ?? 'download'));
    } catch {
      handleError(createLightboxError('LOAD_FAILED', 'Download failed.'));
    }
  }, [item, onDownload, handleError]);

  const swipe = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
    enabled: open && transform.zoom <= minZoom,
  });

  useKeyboard({
    enabled: open,
    onEscape: closeOnEscape ? onClose : undefined,
    onArrowLeft: goPrev,
    onArrowRight: goNext,
    onPlus: zoomIn,
    onMinus: zoomOut,
  });

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!closeOnBackdropClick) return;
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  const handleContentClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const contextValue: LightboxContextValue = useMemo(
    () => ({
      items,
      index,
      item,
      total,
      transform,
      isFullscreen,
      showToolbar,
      showDownload,
      showFullscreen,
      showZoom,
      showRotate,
      showNavigation,
      icons,
      onClose,
      onPrev: goPrev,
      onNext: goNext,
      onZoomIn: zoomIn,
      onZoomOut: zoomOut,
      onRotateLeft: rotateLeft,
      onRotateRight: rotateRight,
      onReset: reset,
      onDownload: () => {
        void handleDownload();
      },
      onToggleFullscreen: () => {
        void toggleFullscreen();
      },
      onError: handleError,
    }),
    [
      items,
      index,
      item,
      total,
      transform,
      isFullscreen,
      showToolbar,
      showDownload,
      showFullscreen,
      showZoom,
      showRotate,
      showNavigation,
      icons,
      onClose,
      goPrev,
      goNext,
      zoomIn,
      zoomOut,
      rotateLeft,
      rotateRight,
      reset,
      handleDownload,
      toggleFullscreen,
      handleError,
    ],
  );

  if (!open || typeof document === 'undefined') {
    return null;
  }

  if (total === 0 || !item) {
    const err = createLightboxError('MEDIA_NOT_FOUND', 'No media items to display.');
    return createPortal(
      <Overlay
        dialogRef={dialogRef}
        animation={animation}
        className={className}
        style={style}
        label="Lightbox"
        indexLabel=""
        onClick={closeOnBackdropClick ? onClose : undefined}
      >
        <button
          type="button"
          className="lbjs-icon-btn lbjs-close-standalone"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          {icons.close}
        </button>
        {renderError ? renderError(err) : <ErrorDisplay error={err} />}
      </Overlay>,
      document.body,
    );
  }

  const indexLabel = `Item ${index + 1} of ${total}${item.title ? `: ${item.title}` : ''}`;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    swipe.onPointerDown(e);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    swipe.onPointerUp(e);
  };

  return createPortal(
    <LightboxProvider value={contextValue}>
      <Overlay
        dialogRef={dialogRef}
        animation={animation}
        className={className}
        style={style}
        label={item.title ? `Lightbox: ${item.title}` : 'Lightbox'}
        indexLabel={indexLabel}
        onClick={handleBackdropClick}
      >
        <Toolbar renderToolbar={renderToolbar} />
        <div
          className="lbjs-content"
          onClick={handleContentClick}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={swipe.onPointerCancel}
        >
          <Navigation />
          <MediaViewer
            item={item}
            index={index}
            transform={transform}
            minZoom={minZoom}
            maxZoom={maxZoom}
            showDownload={showDownload && item.download !== false}
            onZoomChange={setZoom}
            onPan={setPan}
            onError={handleError}
            onDownload={onDownload}
            renderItem={renderItem}
            renderLoading={renderLoading}
            renderError={renderError ?? ((error) => <ErrorDisplay error={error} />)}
          />
        </div>
      </Overlay>
    </LightboxProvider>,
    document.body,
  );
}
