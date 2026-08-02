import type { CSSProperties, ReactNode } from 'react';
import type { LightboxError } from '../utils/errorHandler';

/** Supported media categories resolved from an item. */
export type MediaType = 'image' | 'pdf' | 'video' | 'audio' | 'file';

/** Built-in lightbox enter/exit animation styles. */
export type AnimationType = 'smooth' | 'fade' | 'none';

/**
 * A single media entry displayed inside the lightbox.
 * Extra fields may be stored in `metadata` for custom renderers.
 */
export interface LightboxItem {
  id?: string;
  src: string;
  type?: MediaType;
  title?: string;
  description?: string;
  thumbnail?: string;
  /** Per-item download override. Falls back to the global `showDownload` prop. */
  download?: boolean;
  alt?: string;
  metadata?: Record<string, unknown>;
}

/** Icon components that can be overridden via the `icons` prop. */
export interface LightboxIcons {
  close: ReactNode;
  download: ReactNode;
  fullscreen: ReactNode;
  fullscreenExit: ReactNode;
  zoomIn: ReactNode;
  zoomOut: ReactNode;
  rotateLeft: ReactNode;
  rotateRight: ReactNode;
  prev: ReactNode;
  next: ReactNode;
  reset: ReactNode;
}

/** Props passed to a custom `renderToolbar` implementation. */
export interface ToolbarRenderProps {
  item: LightboxItem;
  index: number;
  total: number;
  zoom: number;
  rotate: number;
  isFullscreen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  onDownload: () => void;
  onToggleFullscreen: () => void;
}

/** Public props for the `<Lightbox />` component. */
export interface LightboxProps {
  open: boolean;
  onClose: () => void;
  items: LightboxItem[];
  /** Controlled current index. */
  index?: number;
  /** Uncontrolled initial index when `index` is omitted. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;

  showToolbar?: boolean;
  showDownload?: boolean;
  showFullscreen?: boolean;
  showZoom?: boolean;
  showRotate?: boolean;
  showNavigation?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  loop?: boolean;
  animation?: AnimationType;
  className?: string;
  style?: CSSProperties;

  renderToolbar?: (props: ToolbarRenderProps) => ReactNode;
  renderItem?: (item: LightboxItem, index: number) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: LightboxError) => ReactNode;
  icons?: Partial<LightboxIcons>;

  onError?: (error: LightboxError) => void;
  onDownload?: (item: LightboxItem) => void;

  /** Zoom increment used by zoom controls (default `0.25`). */
  zoomStep?: number;
  /** Maximum zoom level (default `5`). */
  maxZoom?: number;
  /** Minimum zoom level (default `1`). */
  minZoom?: number;
}

/** Shared transform state for zoom / pan / rotate viewers. */
export interface MediaTransform {
  x: number;
  y: number;
  zoom: number;
  rotate: number;
}

/** Resolved media type + validated source for a lightbox item. */
export interface ResolvedMedia {
  item: LightboxItem;
  type: MediaType;
  src: string;
  filename: string;
}
