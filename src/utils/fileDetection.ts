import type { MediaType } from '../types';

const IMAGE_EXTS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'svg',
  'avif',
  'bmp',
  'ico',
]);

const VIDEO_EXTS = new Set(['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v']);
const AUDIO_EXTS = new Set(['mp3', 'wav', 'ogg', 'oga', 'aac', 'm4a', 'flac']);
const PDF_EXTS = new Set(['pdf']);
const TEXT_EXTS = new Set(['txt', 'md', 'json', 'csv', 'log', 'xml', 'html', 'css', 'js', 'ts']);

/**
 * Extract a lowercase file extension from a URL or path, ignoring query/hash.
 */
export function getExtension(src: string): string {
  try {
    const withoutQuery = src.split(/[?#]/)[0] ?? src;
    const lastSegment = withoutQuery.split('/').pop() ?? '';
    const dot = lastSegment.lastIndexOf('.');
    if (dot === -1 || dot === lastSegment.length - 1) return '';
    return lastSegment.slice(dot + 1).toLowerCase();
  } catch {
    return '';
  }
}

/**
 * Infer a {@link MediaType} from a source URL when `type` is not provided.
 */
export function detectMediaType(src: string): MediaType {
  const ext = getExtension(src);

  if (IMAGE_EXTS.has(ext)) return 'image';
  if (PDF_EXTS.has(ext)) return 'pdf';
  if (VIDEO_EXTS.has(ext)) return 'video';
  if (AUDIO_EXTS.has(ext) || (ext === 'ogg' && !VIDEO_EXTS.has(ext))) return 'audio';
  if (TEXT_EXTS.has(ext)) return 'file';

  return 'file';
}

/**
 * Resolve the effective media type for an item (explicit type wins).
 */
export function resolveMediaType(src: string, type?: MediaType): MediaType {
  if (type) return type;
  return detectMediaType(src);
}

export function isImageType(type: MediaType): boolean {
  return type === 'image';
}

export function supportsTransform(type: MediaType): boolean {
  return type === 'image' || type === 'pdf';
}
