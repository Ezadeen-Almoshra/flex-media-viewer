import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';

export interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal distance in px to count as a swipe (default 50). */
  threshold?: number;
  /** Disable swipe handling (e.g. when zoomed). */
  enabled?: boolean;
}

/**
 * Detect horizontal swipe gestures via Pointer Events.
 * Returns pointer handlers to attach to a container.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  enabled = true,
}: UseSwipeOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
      tracking.current = true;
      startX.current = event.clientX;
      startY.current = event.clientY;
    },
    [enabled],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || !tracking.current) return;
      tracking.current = false;

      const dx = event.clientX - startX.current;
      const dy = event.clientY - startY.current;

      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    },
    [enabled, threshold, onSwipeLeft, onSwipeRight],
  );

  const onPointerCancel = useCallback(() => {
    tracking.current = false;
  }, []);

  return { onPointerDown, onPointerUp, onPointerCancel };
}
