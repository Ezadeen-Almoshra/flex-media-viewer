import type { LightboxItem } from '../types';
import { sanitizeFilename } from './validation';

/**
 * Attempt to download a media resource.
 * Uses fetch + blob when CORS allows; otherwise opens the URL in a new tab.
 */
export async function downloadMedia(
  item: LightboxItem,
  filename?: string,
): Promise<void> {
  const name = filename ?? sanitizeFilename(item.src, item.title ?? 'download');

  try {
    const response = await fetch(item.src, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = name;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch {
    // Fallback: open in new tab (works for cross-origin without CORS)
    const link = document.createElement('a');
    link.href = item.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
