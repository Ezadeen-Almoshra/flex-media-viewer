import { describe, it, expect } from 'vitest';
import { detectMediaType, resolveMediaType, getExtension } from '../src/utils/fileDetection';
import { validateSource, sanitizeFilename } from '../src/utils/validation';
import { LightboxError, createLightboxError } from '../src/utils/errorHandler';

describe('fileDetection', () => {
  it('extracts extensions ignoring query strings', () => {
    expect(getExtension('https://cdn.example.com/photo.PNG?w=800')).toBe('png');
    expect(getExtension('/docs/report.pdf#page=2')).toBe('pdf');
  });

  it('detects media types from extensions', () => {
    expect(detectMediaType('a.jpg')).toBe('image');
    expect(detectMediaType('a.webp')).toBe('image');
    expect(detectMediaType('a.pdf')).toBe('pdf');
    expect(detectMediaType('a.mp4')).toBe('video');
    expect(detectMediaType('a.mp3')).toBe('audio');
    expect(detectMediaType('a.zip')).toBe('file');
  });

  it('prefers explicit type over detection', () => {
    expect(resolveMediaType('a.jpg', 'file')).toBe('file');
  });
});

describe('validation', () => {
  it('rejects empty and dangerous sources', () => {
    expect(validateSource('')?.code).toBe('INVALID_SOURCE');
    expect(validateSource('javascript:alert(1)')?.code).toBe('INVALID_SOURCE');
    expect(validateSource('data:text/html,hi')?.code).toBe('INVALID_SOURCE');
  });

  it('allows http(s) and relative URLs', () => {
    expect(validateSource('https://example.com/a.png')).toBeNull();
    expect(validateSource('/images/a.png')).toBeNull();
    expect(validateSource('//cdn.example.com/a.png')).toBeNull();
  });

  it('sanitizes dangerous filenames', () => {
    expect(sanitizeFilename('../../etc/passwd')).not.toContain('..');
    expect(sanitizeFilename('photo<script>.png')).not.toContain('<');
  });
});

describe('LightboxError', () => {
  it('creates typed errors with default messages', () => {
    const err = createLightboxError('LOAD_FAILED');
    expect(err).toBeInstanceOf(LightboxError);
    expect(err.code).toBe('LOAD_FAILED');
    expect(err.message.length).toBeGreaterThan(0);
  });
});
