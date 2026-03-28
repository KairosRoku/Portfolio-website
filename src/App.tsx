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

const Live2DModelDetail = lazy(() => import('./pages/live2d/Live2DModelDetail'));

function App() {
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
