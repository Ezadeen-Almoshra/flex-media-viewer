import { GalleryDemo } from './GalleryDemo';

export default function HomePage() {
  return (
    <main className="page">
      <h1>flex-media-viewer</h1>
      <p>
        Next.js App Router example. The lightbox is a Client Component; this page can remain a
        Server Component.
      </p>
      <GalleryDemo />
    </main>
  );
}
