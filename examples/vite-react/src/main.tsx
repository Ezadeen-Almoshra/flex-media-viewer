import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'flex-media-viewer/styles.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
