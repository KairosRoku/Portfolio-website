import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('error', (e) => {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:red;color:white;z-index:99999;padding:2rem;overflow:auto;font-family:monospace;';
  errDiv.innerHTML = `<h1>Global Error</h1><pre>${e.error?.stack || e.message}</pre>`;
  document.body.appendChild(errDiv);
});

window.addEventListener('unhandledrejection', (e) => {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:darkred;color:white;z-index:99999;padding:2rem;overflow:auto;font-family:monospace;';
  errDiv.innerHTML = `<h1>Unhandled Promise Rejection</h1><pre>${e.reason?.stack || e.reason}</pre>`;
  document.body.appendChild(errDiv);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
