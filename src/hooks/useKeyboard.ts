import { useEffect } from 'react';

export interface KeyboardHandlers {
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onPlus?: () => void;
  onMinus?: () => void;
  enabled?: boolean;
}

/**
 * Bind keyboard shortcuts while the lightbox is open.
 */
export function useKeyboard({
  onEscape,
  onArrowLeft,
  onArrowRight,
  onPlus,
  onMinus,
  enabled = true,
}: KeyboardHandlers): void {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const handler = (event: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
        case '+':
        case '=':
          event.preventDefault();
          onPlus?.();
          break;
        case '-':
        case '_':
          event.preventDefault();
          onMinus?.();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [enabled, onEscape, onArrowLeft, onArrowRight, onPlus, onMinus]);
}
