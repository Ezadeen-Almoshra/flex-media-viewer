import { createLightboxError, type LightboxError } from './errorHandler';
import { getExtension } from './fileDetection';

const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript|file):/i;

/**
 * Validate that a media source URL is safe to use in the lightbox.
 * Allows http(s), protocol-relative, and relative paths.
 */
export function validateSource(src: string): LightboxError | null {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return createLightboxError('INVALID_SOURCE', 'Media source is empty.');
  }

  const trimmed = src.trim();

  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    return createLightboxError(
      'INVALID_SOURCE',
      'Media source uses a disallowed protocol.',
    );
  }

  // Absolute URLs must be http(s)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return createLightboxError(
          'INVALID_SOURCE',
          `Unsupported URL protocol: ${url.protocol}`,
        );
      }
    } catch {
      return createLightboxError('INVALID_SOURCE', 'Media source URL is malformed.');
    }
  }

  return null;
}

/**
 * Produce a safe download filename from a URL or provided title.
 * Strips path traversal and control characters.
 */
export function sanitizeFilename(src: string, fallback = 'download'): string {
  let name = fallback;

  try {
    const withoutQuery = src.split(/[?#]/)[0] ?? src;
    const segment = withoutQuery.split('/').pop() ?? '';
    if (segment) {
      name = segment;
    }
  } catch {
    // keep fallback
  }

  // Remove path separators and control chars
  name = name.replace(/[/\\?%*:|"<>]/g, '_').replace(/[\x00-\x1f\x7f]/g, '');

  // Collapse dots used for traversal
  name = name.replace(/\.{2,}/g, '.');

  if (!name || name === '.' || name === '..') {
    name = fallback;
  }

  // Cap length
  if (name.length > 200) {
    const ext = getExtension(name);
    const base = name.slice(0, 200 - (ext ? ext.length + 1 : 0));
    name = ext ? `${base}.${ext}` : base;
  }

  return name;
}

/**
 * Escape text for safe use in HTML attributes / text content contexts.
 * Prefer React text children over building HTML strings.
 */
export function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
