# flex-media-viewer

A highly flexible, **dependency-free** Lightbox for React and Next.js.

Supports images, PDFs, video, audio, and generic files — with zoom, rotate, fullscreen, keyboard/touch navigation, accessibility, and full render-prop customization.

**Live demo:** [ezadeen-almoshra.github.io/flex-media-viewer](https://ezadeen-almoshra.github.io/flex-media-viewer/)

- React 18+ / 19+
- Next.js App Router & Pages Router
- Vite / TypeScript
- Zero runtime dependencies (peer: `react`, `react-dom` only)

## Installation

```bash
npm install flex-media-viewer
```

```bash
yarn add flex-media-viewer
```

```bash
pnpm add flex-media-viewer
```

Import the stylesheet once in your app:

```ts
import 'flex-media-viewer/styles.css';
```

## Basic example

```tsx
import { useState } from 'react';
import { Lightbox, type LightboxItem } from 'flex-media-viewer';
import 'flex-media-viewer/styles.css';

const items: LightboxItem[] = [
  { src: '/photos/one.jpg', title: 'One' },
  { src: '/photos/two.webp', title: 'Two' },
  { src: '/docs/manual.pdf', title: 'Manual', type: 'pdf' },
];

export function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
      >
        Open lightbox
      </button>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        index={index}
        onIndexChange={setIndex}
        showDownload
        showFullscreen
        animation="smooth"
      />
    </>
  );
}
```

## `useLightbox` hook

```tsx
import { Lightbox, useLightbox } from 'flex-media-viewer';

function Gallery({ items }) {
  const { open, index, openAt, close, setIndex } = useLightbox();

  return (
    <>
      {items.map((item, i) => (
        <button key={item.src} type="button" onClick={() => openAt(i)}>
          Open #{i + 1}
        </button>
      ))}
      <Lightbox
        open={open}
        onClose={close}
        items={items}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
```

## Next.js (App Router)

The package ships with a `"use client"` banner so it works with the App Router. Keep interactive usage in a Client Component:

```tsx
// app/gallery/GalleryClient.tsx
'use client';

import { Lightbox, useLightbox } from 'flex-media-viewer';

export function GalleryClient({ items }) {
  const lightbox = useLightbox();
  return (
    <>
      <button type="button" onClick={() => lightbox.openAt(0)}>
        Open
      </button>
      <Lightbox
        open={lightbox.open}
        onClose={lightbox.close}
        items={items}
        index={lightbox.index}
        onIndexChange={lightbox.setIndex}
      />
    </>
  );
}
```

```tsx
// app/gallery/page.tsx — Server Component
import 'flex-media-viewer/styles.css';
import { GalleryClient } from './GalleryClient';

export default function Page() {
  return <GalleryClient items={[/* ... */]} />;
}
```

### Pages Router

```tsx
import 'flex-media-viewer/styles.css';
import { Lightbox } from 'flex-media-viewer';
```

## Images

Supported extensions: `jpg`, `jpeg`, `png`, `webp`, `gif`, `svg`, `avif`, and more.

```tsx
const items = [
  {
    src: 'https://cdn.example.com/photo.jpg',
    title: 'Sunset',
    alt: 'Orange sunset over the ocean',
    type: 'image', // optional — auto-detected from extension
  },
];
```

Features: zoom in/out, double-click zoom, pinch zoom, pan when zoomed, rotate, download, fullscreen, swipe / arrow navigation.

## PDF

Uses the browser’s native PDF viewer via `<iframe>` / `<object>` — no PDF.js.

```tsx
const items = [
  {
    src: '/files/report.pdf',
    title: 'Q1 Report',
    type: 'pdf',
  },
];
```

## Video & audio

```tsx
const items = [
  { src: '/clips/intro.mp4', type: 'video', title: 'Intro' },
  { src: '/audio/track.mp3', type: 'audio', title: 'Track' },
];
```

## Generic files

Unknown or binary files fall back to a download / open card:

```tsx
const items = [
  {
    type: 'file',
    src: '/downloads/document.zip',
    title: 'document.zip',
    description: 'Project archive',
  },
];
```

## Custom toolbar

```tsx
<Lightbox
  open={open}
  onClose={close}
  items={items}
  renderToolbar={({ item, index, total, onClose, onPrev, onNext, onDownload }) => (
    <div className="my-toolbar">
      <span>
        {index + 1}/{total} — {item.title}
      </span>
      <button type="button" onClick={onPrev}>Prev</button>
      <button type="button" onClick={onNext}>Next</button>
      <button type="button" onClick={onDownload}>Save</button>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  )}
/>
```

## Custom media renderer

```tsx
<Lightbox
  open={open}
  onClose={close}
  items={items}
  renderItem={(item) => <MyViewer item={item} />}
  renderLoading={() => <Spinner />}
  renderError={(error) => <p>{error.message}</p>}
/>
```

## Custom icons

```tsx
<Lightbox
  open={open}
  onClose={close}
  items={items}
  icons={{
    close: <MyCloseIcon />,
    download: <MyDownloadIcon />,
  }}
/>
```

## Events & errors

```tsx
import { Lightbox, type LightboxError } from 'flex-media-viewer';

<Lightbox
  open={open}
  onClose={close}
  items={items}
  onIndexChange={(i) => console.log('index', i)}
  onDownload={(item) => console.log('download', item.src)}
  onError={(error: LightboxError) => {
    console.error(error.code, error.message);
  }}
/>
```

Error codes:

| Code | Meaning |
|------|---------|
| `MEDIA_NOT_FOUND` | No item / empty gallery |
| `INVALID_SOURCE` | Empty, malformed, or unsafe URL |
| `UNSUPPORTED_TYPE` | Reserved for future use |
| `LOAD_FAILED` | Resource failed to load |

## CSS variables

Override theme tokens after importing the stylesheet:

```css
:root {
  --lightbox-background: rgba(0, 0, 0, 0.92);
  --lightbox-toolbar-color: #ffffff;
  --lightbox-toolbar-bg: rgba(0, 0, 0, 0.85);
  --lightbox-animation-duration: 300ms;
  --lightbox-z-index: 10000;
  --lightbox-focus-ring: #4dabf7;
}
```

## Props reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called when the lightbox should close |
| `items` | `LightboxItem[]` | — | Media items |
| `index` | `number` | — | Controlled current index |
| `defaultIndex` | `number` | `0` | Uncontrolled initial index |
| `onIndexChange` | `(index: number) => void` | — | Fired when the index changes |
| `showToolbar` | `boolean` | `true` | Show the toolbar |
| `showDownload` | `boolean` | `true` | Show download control |
| `showFullscreen` | `boolean` | `true` | Show fullscreen control |
| `showZoom` | `boolean` | `true` | Show zoom controls |
| `showRotate` | `boolean` | `true` | Show rotate controls (images) |
| `showNavigation` | `boolean` | `true` | Show prev/next buttons |
| `closeOnBackdropClick` | `boolean` | `true` | Close when clicking the backdrop |
| `closeOnEscape` | `boolean` | `true` | Close on Escape |
| `loop` | `boolean` | `true` | Loop gallery navigation |
| `animation` | `'smooth' \| 'fade' \| 'none'` | `'smooth'` | Enter animation |
| `className` | `string` | — | Extra class on the root |
| `style` | `CSSProperties` | — | Inline styles on the root |
| `renderToolbar` | `(props) => ReactNode` | — | Custom toolbar |
| `renderItem` | `(item, index) => ReactNode` | — | Custom media renderer |
| `renderLoading` | `() => ReactNode` | — | Custom loading UI |
| `renderError` | `(error) => ReactNode` | — | Custom error UI |
| `icons` | `Partial<LightboxIcons>` | — | Override default icons |
| `onError` | `(error) => void` | — | Error callback |
| `onDownload` | `(item) => void` | — | Custom download handler |
| `zoomStep` | `number` | `0.25` | Zoom increment |
| `minZoom` | `number` | `1` | Minimum zoom |
| `maxZoom` | `number` | `5` | Maximum zoom |

### `LightboxItem`

```ts
interface LightboxItem {
  id?: string;
  src: string;
  type?: 'image' | 'pdf' | 'video' | 'audio' | 'file';
  title?: string;
  description?: string;
  thumbnail?: string;
  download?: boolean;
  alt?: string;
  metadata?: Record<string, unknown>;
}
```

## Keyboard & accessibility

- `Esc` — close
- `←` / `→` — previous / next
- `+` / `-` — zoom in / out
- Focus trap while open
- `role="dialog"`, `aria-modal`, labelled controls
- Screen-reader live region for the current index
- Body scroll lock + iOS safe-area insets

## Troubleshooting

**Download fails for cross-origin files**  
Browsers block blob downloads without CORS. The library falls back to opening the URL in a new tab. Serve assets with CORS headers, or provide `onDownload`.

**PDF shows a blank frame**  
Some hosts send `X-Frame-Options` / CSP that block iframes. Host the PDF yourself or open it via the fallback link.

**SSR / Next.js hydration**  
Import styles in a layout or Client Component. Do not render `Lightbox` with `open={true}` during SSR if that causes layout shift — start closed and open on user interaction.

**TypeScript path / module resolution**  
Ensure your project uses `moduleResolution: "bundler"` or `"node16"`+ so `exports` in `package.json` resolve correctly.

## Examples

- [`examples/vite-react`](./examples/vite-react) — Vite SPA demo
- [`examples/nextjs`](./examples/nextjs) — Next.js App Router demo

```bash
# from repo root
npm run build

cd examples/vite-react && npm install && npm run dev
# or
cd examples/nextjs && npm install && npm run dev
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## License

MIT
