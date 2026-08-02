import { useCallback, useEffect, useState } from 'react';

export interface UseLightboxOptions {
  initialIndex?: number;
  initialOpen?: boolean;
}

export interface UseLightboxReturn {
  open: boolean;
  index: number;
  isOpen: boolean;
  openAt: (index?: number) => void;
  openLightbox: (index?: number) => void;
  close: () => void;
  closeLightbox: () => void;
  setIndex: (index: number) => void;
  next: (total: number, loop?: boolean) => void;
  prev: (total: number, loop?: boolean) => void;
}

/**
 * Convenience hook for managing lightbox open state and current index.
 */
export function useLightbox(options: UseLightboxOptions = {}): UseLightboxReturn {
  const { initialIndex = 0, initialOpen = false } = options;
  const [open, setOpen] = useState(initialOpen);
  const [index, setIndex] = useState(initialIndex);

  const openAt = useCallback((i = 0) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const next = useCallback((total: number, loop = true) => {
    setIndex((current) => {
      if (total <= 0) return 0;
      if (current >= total - 1) return loop ? 0 : current;
      return current + 1;
    });
  }, []);

  const prev = useCallback((total: number, loop = true) => {
    setIndex((current) => {
      if (total <= 0) return 0;
      if (current <= 0) return loop ? total - 1 : current;
      return current - 1;
    });
  }, []);

  return {
    open,
    index,
    isOpen: open,
    openAt,
    openLightbox: openAt,
    close,
    closeLightbox: close,
    setIndex,
    next,
    prev,
  };
}

/**
 * Sync controlled index from props into local state when provided.
 */
export function useControlledIndex(
  controlledIndex: number | undefined,
  defaultIndex: number,
  onIndexChange?: (index: number) => void,
): [number, (index: number) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultIndex);
  const isControlled = controlledIndex !== undefined;
  const index = isControlled ? controlledIndex : uncontrolled;

  useEffect(() => {
    if (!isControlled) {
      setUncontrolled(defaultIndex);
    }
  }, [defaultIndex, isControlled]);

  const setIndex = useCallback(
    (next: number) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onIndexChange?.(next);
    },
    [isControlled, onIndexChange],
  );

  return [index, setIndex];
}
