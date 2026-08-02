'use client';

import { Lightbox, useLightbox, type LightboxItem } from 'flex-media-viewer';

const items: LightboxItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600',
    title: 'Desert Road',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600',
    title: 'Foggy Hills',
    type: 'image',
  },
  {
    src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    title: 'PDF Document',
    type: 'pdf',
  },
];

export function GalleryDemo() {
  const { open, index, openAt, close, setIndex } = useLightbox();

  return (
    <>
      <div className="grid">
        {items.map((item, i) => (
          <button key={item.src} type="button" className="thumb" onClick={() => openAt(i)}>
            {item.type === 'image' ? (
              <img src={item.src} alt={item.title ?? ''} />
            ) : (
              <span>{item.title}</span>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        onClose={close}
        items={items}
        index={index}
        onIndexChange={setIndex}
        animation="fade"
      />
    </>
  );
}
