import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import type { MediaTransform } from '../types';

const INITIAL: MediaTransform = { x: 0, y: 0, zoom: 1, rotate: 0 };

export interface UseMediaTransformOptions {
  zoomStep?: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface UseMediaTransformReturn {
  transform: MediaTransform;
  setTransform: Dispatch<SetStateAction<MediaTransform>>;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  reset: () => void;
  panBy: (dx: number, dy: number) => void;
  setPan: (x: number, y: number) => void;
}

/**
 * Shared zoom / pan / rotate state for image and PDF viewers.
 */
export function useMediaTransform(
  options: UseMediaTransformOptions = {},
): UseMediaTransformReturn {
  const { zoomStep = 0.25, minZoom = 1, maxZoom = 5 } = options;
  const [transform, setTransform] = useState<MediaTransform>(INITIAL);

  const clampZoom = useCallback(
    (value: number) => Math.min(maxZoom, Math.max(minZoom, value)),
    [minZoom, maxZoom],
  );

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      zoom: clampZoom(prev.zoom + zoomStep),
    }));
  }, [clampZoom, zoomStep]);

  const zoomOut = useCallback(() => {
    setTransform((prev) => {
      const nextZoom = clampZoom(prev.zoom - zoomStep);
      return {
        ...prev,
        zoom: nextZoom,
        x: nextZoom <= minZoom ? 0 : prev.x,
        y: nextZoom <= minZoom ? 0 : prev.y,
      };
    });
  }, [clampZoom, zoomStep, minZoom]);

  const setZoom = useCallback(
    (zoom: number) => {
      setTransform((prev) => {
        const nextZoom = clampZoom(zoom);
        return {
          ...prev,
          zoom: nextZoom,
          x: nextZoom <= minZoom ? 0 : prev.x,
          y: nextZoom <= minZoom ? 0 : prev.y,
        };
      });
    },
    [clampZoom, minZoom],
  );

  const rotateLeft = useCallback(() => {
    setTransform((prev) => ({ ...prev, rotate: prev.rotate - 90 }));
  }, []);

  const rotateRight = useCallback(() => {
    setTransform((prev) => ({ ...prev, rotate: prev.rotate + 90 }));
  }, []);

  const reset = useCallback(() => {
    setTransform(INITIAL);
  }, []);

  const panBy = useCallback((dx: number, dy: number) => {
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setTransform((prev) => ({ ...prev, x, y }));
  }, []);

  return {
    transform,
    setTransform,
    zoomIn,
    zoomOut,
    setZoom,
    rotateLeft,
    rotateRight,
    reset,
    panBy,
    setPan,
  };
}

export function createTransformStyle(transform: MediaTransform): string {
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.zoom}) rotate(${transform.rotate}deg)`;
}
