import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';

function distance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export interface UsePinchZoomOptions {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  onZoomChange: (zoom: number) => void;
  enabled?: boolean;
}

/**
 * Two-finger pinch-to-zoom using Pointer Events.
 * Returns handlers to spread onto the zoomable element.
 */
export function usePinchZoom({
  zoom,
  minZoom,
  maxZoom,
  onZoomChange,
  enabled = true,
}: UsePinchZoomOptions) {
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const initialDistance = useRef(0);
  const initialZoom = useRef(zoom);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled) return;
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.current.size === 2) {
        const pts = Array.from(pointers.current.values());
        const a = pts[0];
        const b = pts[1];
        if (a && b) {
          initialDistance.current = distance(a, b);
          initialZoom.current = zoom;
        }
      }
    },
    [enabled, zoom],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || !pointers.current.has(event.pointerId)) return;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.current.size === 2 && initialDistance.current > 0) {
        const pts = Array.from(pointers.current.values());
        const a = pts[0];
        const b = pts[1];
        if (!a || !b) return;

        const current = distance(a, b);
        const scale = current / initialDistance.current;
        const next = Math.min(maxZoom, Math.max(minZoom, initialZoom.current * scale));
        onZoomChange(next);
      }
    },
    [enabled, minZoom, maxZoom, onZoomChange],
  );

  const onPointerUp = useCallback((event: ReactPointerEvent) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) {
      initialDistance.current = 0;
    }
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}
