/** Known lightbox error codes. */
export type LightboxErrorCode =
  | 'MEDIA_NOT_FOUND'
  | 'INVALID_SOURCE'
  | 'UNSUPPORTED_TYPE'
  | 'LOAD_FAILED';

const DEFAULT_MESSAGES: Record<LightboxErrorCode, string> = {
  MEDIA_NOT_FOUND: 'The requested media item could not be found.',
  INVALID_SOURCE: 'The media source URL is invalid or unsafe.',
  UNSUPPORTED_TYPE: 'This media type is not supported.',
  LOAD_FAILED: 'Failed to load the media resource.',
};

/**
 * Typed error used throughout the lightbox for load/validation failures.
 * Never thrown uncaught from the UI layer — surfaced via `onError` and error UI.
 */
export class LightboxError extends Error {
  readonly code: LightboxErrorCode;

  constructor(code: LightboxErrorCode, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = 'LightboxError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function createLightboxError(
  code: LightboxErrorCode,
  message?: string,
): LightboxError {
  return new LightboxError(code, message);
}
