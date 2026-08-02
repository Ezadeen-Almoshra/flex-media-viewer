import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLightbox } from '../src/hooks/useLightbox';

describe('useLightbox', () => {
  it('opens at a given index and closes', () => {
    const { result } = renderHook(() => useLightbox());

    act(() => {
      result.current.openAt(2);
    });
    expect(result.current.open).toBe(true);
    expect(result.current.index).toBe(2);

    act(() => {
      result.current.close();
    });
    expect(result.current.open).toBe(false);
  });

  it('navigates with loop', () => {
    const { result } = renderHook(() => useLightbox({ initialIndex: 0 }));

    act(() => {
      result.current.prev(3, true);
    });
    expect(result.current.index).toBe(2);

    act(() => {
      result.current.next(3, true);
    });
    expect(result.current.index).toBe(0);
  });
});
