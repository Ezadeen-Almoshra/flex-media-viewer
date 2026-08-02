import { memo } from 'react';

export interface LoadingProps {
  label?: string;
}

function LoadingComponent({ label = 'Loading…' }: LoadingProps) {
  return (
    <div className="lbjs-loading" role="status" aria-live="polite" aria-label={label}>
      <div className="lbjs-spinner" aria-hidden="true" />
      <span className="lbjs-loading-text">{label}</span>
    </div>
  );
}

export const Loading = memo(LoadingComponent);
