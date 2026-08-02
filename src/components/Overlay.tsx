'use client';

import { memo, type CSSProperties, type MouseEvent, type ReactNode, type RefObject } from 'react';
import type { AnimationType } from '../types';

export interface OverlayProps {
  animation: AnimationType;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  dialogRef: RefObject<HTMLDivElement | null>;
  label: string;
  indexLabel: string;
}

function OverlayComponent({
  animation,
  onClick,
  children,
  className,
  style,
  dialogRef,
  label,
  indexLabel,
}: OverlayProps) {
  const animationClass =
    animation === 'none'
      ? 'lbjs-anim-none'
      : animation === 'fade'
        ? 'lbjs-anim-fade'
        : 'lbjs-anim-smooth';

  return (
    <div
      ref={dialogRef}
      className={['lbjs-root', animationClass, className].filter(Boolean).join(' ')}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClick}
    >
      <div className="lbjs-sr-only" aria-live="polite" aria-atomic="true">
        {indexLabel}
      </div>
      {children}
    </div>
  );
}

export const Overlay = memo(OverlayComponent);
