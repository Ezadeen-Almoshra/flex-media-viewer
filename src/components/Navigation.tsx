'use client';

import { memo } from 'react';
import { useLightboxContext } from '../context/LightboxContext';

function NavigationComponent() {
  const { total, showNavigation, icons, onPrev, onNext } = useLightboxContext();

  if (!showNavigation || total <= 1) return null;

  return (
    <>
      <button
        type="button"
        className="lbjs-nav lbjs-nav-prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous item"
      >
        {icons.prev}
      </button>
      <button
        type="button"
        className="lbjs-nav lbjs-nav-next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next item"
      >
        {icons.next}
      </button>
    </>
  );
}

export const Navigation = memo(NavigationComponent);
