import { useCallback, useEffect, useState, type RefObject } from 'react';

export interface UseFullscreenReturn {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
}

/**
 * Manage Fullscreen API for a container element.
 */
export function useFullscreen(
  containerRef: RefObject<HTMLElement | null>,
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [containerRef]);

  const enterFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el || typeof document === 'undefined') return;
    if (document.fullscreenElement) return;
    try {
      await el.requestFullscreen();
    } catch {
      // Fullscreen may be blocked by the browser
    }
  }, [containerRef]);

  const exitFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      // ignore
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen };
}
