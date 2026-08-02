'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { LightboxIcons, LightboxItem, MediaTransform } from '../types';
import type { LightboxError } from '../utils/errorHandler';

export interface LightboxContextValue {
  items: LightboxItem[];
  index: number;
  item: LightboxItem | null;
  total: number;
  transform: MediaTransform;
  isFullscreen: boolean;
  showToolbar: boolean;
  showDownload: boolean;
  showFullscreen: boolean;
  showZoom: boolean;
  showRotate: boolean;
  showNavigation: boolean;
  icons: LightboxIcons;
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
  onError: (error: LightboxError) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({
  value,
  children,
}: {
  value: LightboxContextValue;
  children: ReactNode;
}) {
  return <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>;
}

export function useLightboxContext(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error('useLightboxContext must be used within a LightboxProvider');
  }
  return ctx;
}
