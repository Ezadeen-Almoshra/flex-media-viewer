import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: https://ezadeen-almoshra.github.io/flex-media-viewer/
  base: '/flex-media-viewer/',
  resolve: {
    // file: linked library resolves react from the repo root — force one copy
    dedupe: ['react', 'react-dom'],
  },
});
