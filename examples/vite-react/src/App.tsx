import { useState } from 'react';
import { Lightbox, useLightbox, type LightboxItem } from 'flex-media-viewer';

const gallery: LightboxItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    title: 'Mountain Lake',
    description: 'Image with zoom & rotate',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600',
    title: 'Forest Path',
    type: 'image',
  },
  {
    src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    title: 'Sample PDF',
    type: 'pdf',
  },
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    title: 'Flower Video',
    type: 'video',
  },
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    title: 'T-Rex Audio',
    type: 'audio',
  },
  {
    src: 'https://example.com/archive.zip',
    title: 'Archive.zip',
    description: 'Generic file fallback',
    type: 'file',
  },
];

export default function App() {
  const { open, index, openAt, close, setIndex } = useLightbox();
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <main className="page">
      <header className="hero">
        <h1>flex-media-viewer</h1>
        <p>Dependency-free React lightbox — images, PDF, video, audio, and files.</p>
      </header>

      <section>
        <h2>Gallery</h2>
        <div className="grid">
          {gallery.map((item, i) => (
            <button key={item.src} type="button" className="thumb" onClick={() => openAt(i)}>
              {item.thumbnail || item.type === 'image' ? (
                <img src={item.thumbnail ?? item.src} alt={item.title ?? ''} />
              ) : (
                <span className="thumb-label">{item.title ?? item.type}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Custom toolbar</h2>
        <button type="button" className="cta" onClick={() => setCustomOpen(true)}>
          Open with custom toolbar
        </button>
      </section>

      <Lightbox
        open={open}
        onClose={close}
        items={gallery}
        index={index}
        onIndexChange={setIndex}
        showDownload
        showFullscreen
        animation="smooth"
      />

      <Lightbox
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        items={gallery.slice(0, 2)}
        renderToolbar={({ item, index, total, onClose, onPrev, onNext }) => (
          <div className="custom-toolbar">
            <strong>
              {index + 1}/{total} — {item.title}
            </strong>
            <div>
              <button type="button" onClick={onPrev}>
                Prev
              </button>
              <button type="button" onClick={onNext}>
                Next
              </button>
              <button type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
        renderItem={(item) => (
          <div className="custom-media">
            <img
              src={item.src}
              alt={item.title ?? ''}
              style={{ maxWidth: '80vw', maxHeight: '70vh' }}
            />
            <p>{item.description ?? 'Custom renderer'}</p>
          </div>
        )}
      />
    </main>
  );
}
