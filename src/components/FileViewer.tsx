'use client';

import { memo, useCallback } from 'react';
import type { LightboxItem } from '../types';
import { downloadMedia } from '../utils/download';
import { sanitizeFilename } from '../utils/validation';
import { FileIcon } from './icons';

export interface FileViewerProps {
  item: LightboxItem;
  showDownload?: boolean;
  onDownload?: (item: LightboxItem) => void;
}

function FileViewerComponent({ item, showDownload = true, onDownload }: FileViewerProps) {
  const filename = sanitizeFilename(item.src, item.title ?? 'file');

  const handleDownload = useCallback(async () => {
    if (onDownload) {
      onDownload(item);
      return;
    }
    await downloadMedia(item, filename);
  }, [item, filename, onDownload]);

  const handleOpen = useCallback(() => {
    window.open(item.src, '_blank', 'noopener,noreferrer');
  }, [item.src]);

  return (
    <div className="lbjs-viewer lbjs-viewer-file">
      <div className="lbjs-file-card">
        <div className="lbjs-file-icon" aria-hidden="true">
          <FileIcon width={48} height={48} />
        </div>
        <h3 className="lbjs-file-name">{item.title ?? filename}</h3>
        {item.description && <p className="lbjs-file-desc">{item.description}</p>}
        <div className="lbjs-file-actions">
          <button type="button" className="lbjs-btn lbjs-btn-secondary" onClick={handleOpen}>
            Open
          </button>
          {showDownload && (
            <button type="button" className="lbjs-btn lbjs-btn-primary" onClick={handleDownload}>
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const FileViewer = memo(FileViewerComponent);
