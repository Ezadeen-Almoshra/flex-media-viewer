import { memo } from 'react';
import type { LightboxError } from '../utils/errorHandler';

export interface ErrorDisplayProps {
  error: LightboxError;
}

function ErrorDisplayComponent({ error }: ErrorDisplayProps) {
  return (
    <div className="lbjs-error" role="alert">
      <p className="lbjs-error-code">{error.code}</p>
      <p className="lbjs-error-message">{error.message}</p>
    </div>
  );
}

export const ErrorDisplay = memo(ErrorDisplayComponent);
