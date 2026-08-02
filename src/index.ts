export type {
  MediaType,
  AnimationType,
  LightboxItem,
  LightboxIcons,
  ToolbarRenderProps,
  LightboxProps,
  MediaTransform,
  ResolvedMedia,
} from './types';

export { LightboxError, createLightboxError } from './utils/errorHandler';
export type { LightboxErrorCode } from './utils/errorHandler';

export { detectMediaType, resolveMediaType, getExtension } from './utils/fileDetection';
export { validateSource, sanitizeFilename } from './utils/validation';
export { downloadMedia } from './utils/download';

export { useLightbox } from './hooks/useLightbox';
export type { UseLightboxOptions, UseLightboxReturn } from './hooks/useLightbox';
export { useKeyboard } from './hooks/useKeyboard';
export { useFullscreen } from './hooks/useFullscreen';
export { useFocusTrap } from './hooks/useFocusTrap';
export { useBodyScrollLock } from './hooks/useBodyScrollLock';
export { useSwipe } from './hooks/useSwipe';
export { usePinchZoom } from './hooks/usePinchZoom';
export { useMediaTransform, createTransformStyle } from './hooks/useMediaTransform';

export { Lightbox } from './components/Lightbox';
export { Toolbar } from './components/Toolbar';
export { MediaViewer } from './components/MediaViewer';
export { ImageViewer } from './components/ImageViewer';
export { PdfViewer } from './components/PdfViewer';
export { VideoViewer } from './components/VideoViewer';
export { AudioViewer } from './components/AudioViewer';
export { FileViewer } from './components/FileViewer';
export { Loading } from './components/Loading';
export { ErrorDisplay } from './components/ErrorDisplay';
export { Navigation } from './components/Navigation';
