import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhotographyShowcase from './pages/photography/PhotographyShowcase';
import PhotographyContact from './pages/photography/PhotographyContact';
import PhotographyOrdering from './pages/photography/PhotographyOrdering';
import Live2DShowcase from './pages/live2d/Live2DShowcase';
import Live2DContact from './pages/live2d/Live2DContact';
import Live2DTOS from './pages/live2d/Live2DTOS';
import GameDevShowcase from './pages/gamedev/GameDevShowcase';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const Live2DModelDetail = lazy(() => import('./pages/live2d/Live2DModelDetail'));

// Globals for network interception - REMOVED since vault is public

function App() {
  const [loading, setLoading] = useState(true);

  // Global anti-theft protection
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventDrag = (e: DragEvent) => e.preventDefault();
    
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDrag);
    
    // Add global CSS to stop text/image selection
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
      }
      input, textarea {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);

    supabase.auth.getSession().then(() => {
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Nothing needed without login lock
    });

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDrag);
      document.head.removeChild(style);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-cottage-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-cottage-50 flex items-center justify-center">Loading...</div>}>
        <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/photography" element={<PhotographyShowcase />} />
        <Route path="/photography/showcase" element={<PhotographyShowcase />} />
        <Route path="/photography/contact" element={<PhotographyContact />} />
        <Route path="/photography/ordering" element={<PhotographyOrdering />} />

        <Route path="/live2d" element={<Live2DShowcase />} />
        <Route path="/live2d/showcase" element={<Live2DShowcase />} />
        <Route path="/live2d/vtubers" element={<Live2DShowcase filter="Vtubers" />} />
        <Route path="/live2d/animation" element={<Live2DShowcase filter="Animation" />} />
        <Route path="/live2d/nsfw" element={<Live2DShowcase filter="NSFW" />} />
        <Route path="/live2d/contact" element={<Live2DContact />} />
        <Route path="/live2d/inquire" element={<Live2DContact />} />
        <Route path="/live2d/tos" element={<Live2DTOS />} />
        <Route path="/live2d/model/:id" element={<Live2DModelDetail />} />

        <Route path="/gamedev" element={<GameDevShowcase />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
