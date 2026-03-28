import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as PIXI from 'pixi.js';
import { supabase, Live2DModel as Live2DModelType } from '../../lib/supabase';
import SectionHeader from '../../components/SectionHeader';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

// Required for pixi-live2d-display
(window as any).PIXI = PIXI;

export default function Live2DModelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelData, setModelData] = useState<Live2DModelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    fetchModel();
  }, [id]);

  const fetchModel = async () => {
    try {
      const { data, error } = await supabase
        .from('live2d_models')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setModelData(data);
    } catch (err: any) {
      console.error('Error fetching model:', err);
      setError('Model not found or connection error');
    } finally {
      if (!error) setLoading(false);
    }
  };

  useEffect(() => {
    if (!modelData?.model_url || !containerRef.current) return;

    // Check if Live2DCubismCore runtime is loaded in the DOM
    if (!(window as any).Live2DCubismCore) {
      setError('Live2DCubismCore is not yet loaded. Please refresh the page in a moment.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Initialize PIXI Application without tying it to an existing canvas yet
    const app = new PIXI.Application({
      resizeTo: containerRef.current,
      backgroundAlpha: 0, // Transparent for custom background gradients
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });
    
    // Cast view to HTMLCanvasElement safely and add custom classes
    const view = app.view as HTMLCanvasElement;
    view.className = "w-full h-full touch-none";
    view.style.position = "absolute";
    view.style.top = "0";
    view.style.left = "0";
    
    containerRef.current.appendChild(view);
    appRef.current = app;

    const initModel = async () => {
      try {
        // Dynamically import only the Cubism 4 module to avoid checking for legacy Live2D objects
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');
        
        if (!isMounted) return;

        const model = await Live2DModel.from(modelData.model_url);
        if (!isMounted) return;
        
        modelRef.current = model;
        app.stage.addChild(model as any);

        const handleResize = () => {
          if (!model) return;
          const scrW = app.screen.width > 0 ? app.screen.width : window.innerWidth;
          const scrH = app.screen.height > 0 ? app.screen.height : parseInt(getComputedStyle(containerRef.current!).height) || window.innerHeight;
          const mW = model.width || 1000;
          const mH = model.height || 1000;
          
          const scale = Math.min(scrW / mW, scrH / mH) * 0.8;
          model.scale.set(scale > 0 ? scale : 0.5);
          
          if ('anchor' in model) {
            (model as any).anchor.set(0.5, 0.5);
          }
          model.x = scrW / 2;
          model.y = (scrH / 2) + (scrH * 0.1); // slight offset downwards
        };

        handleResize();

        // Interaction
        app.stage.interactive = true;
        app.stage.hitArea = new PIXI.Rectangle(0, 0, 10000, 10000);
        app.stage.on('pointermove', (e: any) => {
          if (model.focus) {
            model.focus(e.data.global.x, e.data.global.y);
          }
        });

        // Resize handler
        window.addEventListener('resize', handleResize);

        setLoading(false);
      } catch (err: any) {
        console.error('Error initializing Live2D model:', err);
        setError('Failed to render Live2D model. Ensure the model3.json is valid and runtimes are loaded.');
        setLoading(false);
      }
    };

    initModel();

    return () => {
      isMounted = false;
      if (containerRef.current && view.parentNode === containerRef.current) {
        containerRef.current.removeChild(view);
      }
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [modelData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && !error) {
        setError('Loading is taking longer than expected. Please check your connection or the model files.');
        setLoading(false);
      }
    }, 15000); // 15s timeout

    return () => clearTimeout(timer);
  }, [loading, error]);

  const navLinks = [
    { label: 'All Works', path: '/live2d' },
    { label: 'NSFW', path: '/live2d/nsfw' },
    { label: 'Inquire', path: '/live2d/contact' },
    { label: 'Terms', path: '/live2d/tos' },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-cottage-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-brown-800 mb-2">Something went wrong</h2>
        <p className="text-brown-600 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => navigate('/live2d')}
          className="cottagecore-btn-primary"
        >
          Return to Showcase
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cottage-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-peach-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cottage-50 pt-24 overflow-hidden">
      <SectionHeader section="live2d" links={navLinks} />
      
      {/* Model Interaction Area */}
      <div className="relative w-full h-[calc(100vh-6rem)]">
        {modelData?.model_url ? (
          <div ref={containerRef} className="absolute inset-0 w-full h-full touch-none" />
        ) : modelData?.video_url ? (
          <div className="w-full h-full p-8 flex items-center justify-center">
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-peach-200">
              <iframe
                src={modelData.video_url.includes('youtube.com') 
                  ? modelData.video_url.replace('watch?v=', 'embed/') 
                  : modelData.video_url}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown-400">
            No preview available
          </div>
        )}
        
        {/* Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
          <div className="max-w-xl bg-white/80 backdrop-blur-md p-6 rounded-3xl border-2 border-peach-200 shadow-xl pointer-events-auto animate-fade-in-up">
            <h1 className="text-3xl font-bold text-brown-800 mb-2">{modelData?.title}</h1>
            <p className="text-peach-600 font-semibold mb-3">{modelData?.client} • {modelData?.type}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {modelData?.features.map((feature, idx) => (
                <span key={idx} className="px-3 py-1 bg-sakura-100 text-sakura-700 rounded-full text-sm font-medium border border-sakura-200">
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/live2d/contact')}
                className="w-full py-3 bg-gradient-to-r from-sakura-400 to-peach-400 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Inquire Now
              </button>
              <button
                onClick={() => navigate('/live2d')}
                className="flex items-center justify-center gap-2 text-brown-600 hover:text-brown-800 transition-colors font-medium text-sm"
              >
                <ArrowLeft size={16} />
                Back to Showcase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
