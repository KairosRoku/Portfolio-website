import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as PIXI from 'pixi.js';
import { supabase, Live2DModel as Live2DModelType } from '../../lib/supabase';
import SectionHeader from '../../components/SectionHeader';
import { Loader2, ArrowLeft, AlertCircle, ZoomIn, Move, MousePointerClick } from 'lucide-react';

// Required for pixi-live2d-display
(window as any).PIXI = PIXI;

export default function Live2DModelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelData, setModelData] = useState<Live2DModelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // VTuber Expressions State
  const [expressions, setExpressions] = useState<{name: string, file: string, params: any[]}[]>([]);
  const [activeExpression, setActiveExpression] = useState<number | null>(null);
  
  // Refs for Ticker access
  const activeExpRef = useRef<number | null>(null);
  const expressionsRef = useRef<{name: string, file: string, params: any[]}[]>([]);

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
      
      setModelData(data as Live2DModelType);
    } catch (err: any) {
      console.error('Error fetching model:', err);
      setError('Model not found or connection error');
      setLoading(false);
    } finally {
      // If it's not a live2d model and we just fetched successfully, stop loading.
      // If it IS a model_url, the PIXI canvas will stop loading once drawn.
      supabase.from('live2d_models').select('*').eq('id', id).single().then(({data}) => {
         if (data && !data.model_url) setLoading(false);
      });
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
        
        // Expose Expressions by natively querying the Supabase folder
        const modelUrlParts = modelData.model_url.split('/public/live2d-models/');
        if (modelUrlParts.length === 2) {
           const fullPath = modelUrlParts[1];
           const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
           
           try {
              // Try listing standard structures
              const { data: rootFiles } = await supabase.storage.from('live2d-models').list(folderPath);
              const { data: expFolderFiles } = await supabase.storage.from('live2d-models').list(`${folderPath}/expressions`);
              
              const validFiles: any[] = [];
              if (rootFiles) {
                  rootFiles.forEach(f => {
                      if (f.name.endsWith('.exp3.json') || f.name.endsWith('.exp.json')) {
                          validFiles.push({ path: `${folderPath}/${f.name}`, name: f.name });
                      }
                  });
              }
              if (expFolderFiles) {
                  expFolderFiles.forEach(f => {
                      if (f.name.endsWith('.exp3.json') || f.name.endsWith('.exp.json')) {
                          validFiles.push({ path: `${folderPath}/expressions/${f.name}`, name: f.name });
                      }
                  });
              }
              
              const fetchedExps: {name: string, file: string, params: any[]}[] = [];
              for (const vf of validFiles) {
                  const { data } = await supabase.storage.from('live2d-models').download(vf.path);
                  if (data) {
                      const text = await data.text();
                      try {
                          const json = JSON.parse(text);
                          // Supports Cubism 3/4 (.exp3.json) Parameter format, or Cubism 2 (.exp.json) format
                          const params = json.Parameters || json.parameters || [];
                          fetchedExps.push({
                              name: vf.name.replace('.exp3.json', '').replace('.exp.json', ''),
                              file: vf.name,
                              params: params
                          });
                      } catch (e) {}
                  }
              }
              setExpressions(fetchedExps);
              expressionsRef.current = fetchedExps;
           } catch(e) { console.error("Could not fetch remote expression files"); }
        }

        let currentScale = 1;
        
        const resetLayout = () => {
          if (!model) return;
          const cw = containerRef.current?.clientWidth || 1000;
          const ch = containerRef.current?.clientHeight || 1000;
          const mw = model.width || 1000;
          const mh = model.height || 1000;
          
          const baseScale = Math.min(cw / mw, ch / mh) * 0.8;
          currentScale = baseScale;
          (model as any).scale.set(currentScale);
          
          if ('anchor' in (model as any)) {
            (model as any).anchor.set(0.5, 0.5);
            (model as any).x = cw / 2;
            (model as any).y = (ch / 2) + (ch * 0.1); 
          } else {
            (model as any).x = (cw - mw * currentScale) / 2;
            (model as any).y = ((ch - mh * currentScale) / 2) + (ch * 0.1);
          }
        };

        resetLayout();
        window.addEventListener('resize', resetLayout);

        // Interaction
        app.stage.interactive = true;
        app.stage.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);
        
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        let modelStartPos = { x: 0, y: 0 };

        app.stage.on('pointerdown', (e: any) => {
          isDragging = true;
          dragStart = { x: e.data.global.x, y: e.data.global.y };
          modelStartPos = { x: (model as any).x, y: (model as any).y };
        });

        let targetNormX = 0;
        let targetNormY = 0;
        let currentNormX = 0;
        let currentNormY = 0;
        
        let blinkTimer = 0;
        let isBlinking = false;
        let blinkProgress = 0;

        app.stage.on('pointermove', (e: any) => {
          // Force interactionManager to stop hijacking our focus with scale-bugged bounds
          if ((model as any).internalModel && (model as any).autoInteract !== false) {
             (model as any).autoInteract = false; 
          }
          
          if (isDragging) {
            const dx = e.data.global.x - dragStart.x;
            const dy = e.data.global.y - dragStart.y;
            (model as any).x = modelStartPos.x + dx;
            (model as any).y = modelStartPos.y + dy;
          } else {
            // Absolute tracking mapping the mouse to the physical canvas limits 
            // bypassing PIXI's DPI resolution scaling bugs
            const canvas = appRef.current?.view as HTMLCanvasElement;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const rawX = e.data.global.x; // in logical units
                const rawY = e.data.global.y;
                
                // rect.width and rect.height might be css pixels but e.data.global is logical
                // A very safe logical fallback is standardizing against the PIXI renderer screen
                const sw = app.renderer.screen.width;
                const sh = app.renderer.screen.height;
                
                targetNormX = (rawX / sw) * 2 - 1;
                targetNormY = (1 - (rawY / sh)) * 2 - 1; 
                // Y inversion: Top of screen = 1 (UP), Bottom = -1 (DOWN)
                
                targetNormX = Math.max(-1, Math.min(1, targetNormX));
                targetNormY = Math.max(-1, Math.min(1, targetNormY));
            }
          }
        });

        // Add visual ticker to dynamically enforce parameters and sync perfectly
        // Use a negative priority (-100) equivalent to PIXI.UPDATE_PRIORITY.LOW so it runs AFTER model internal updates
        app.ticker.add((delta) => {
          // Smoothly interpolate the axes
          currentNormX += (targetNormX - currentNormX) * 0.1 * delta;
          currentNormY += (targetNormY - currentNormY) * 0.1 * delta;
          
          // Blinking logic (runs roughly around every 3-5 seconds at 60fps)
          blinkTimer += delta;
          if (blinkTimer > 180 + Math.random() * 120 && !isBlinking) {
             isBlinking = true;
             blinkTimer = 0;
             blinkProgress = 0;
          }
          
          let eyeOpenness = 1;
          if (isBlinking) {
             blinkProgress += delta * 0.2;
             if (blinkProgress >= Math.PI) {
                 isBlinking = false;
             } else {
                 eyeOpenness = 1 - Math.sin(blinkProgress);
             }
          }
          
          if ((model as any).internalModel?.coreModel) {
            const core = ((model as any).internalModel.coreModel as any);
            
            // Absolutely override internal bounds-tracking bugs by clamping exactly to viewport layout overrides
            core.setParameterValueById("ParamAngleX", currentNormX * 30);
            core.setParameterValueById("ParamAngleY", currentNormY * 30);
            core.setParameterValueById("ParamBodyAngleX", currentNormX * 10);
            core.setParameterValueById("ParamBodyAngleY", currentNormY * 10);
            core.setParameterValueById("ParamEyeBallX", currentNormX);
            core.setParameterValueById("ParamEyeBallY", currentNormY);
            
            // Apply Blink
            // Only apply blink if the physics aren't completely overriding it, coreModel forces it at the end
            const targetEyeOpen = eyeOpenness;
            core.setParameterValueById("ParamEyeLOpen", targetEyeOpen);
            core.setParameterValueById("ParamEyeROpen", targetEyeOpen);
            
            // Merge custom expression toggles forcefully
            const currentActive = activeExpRef.current;
            if (currentActive !== null && expressionsRef.current[currentActive]) {
                const activeExp = expressionsRef.current[currentActive];
                // Standard JSON definitions have { Id, Value, Blend } or { id, val }
                activeExp.params.forEach(p => {
                    const pId = p.Id || p.id;
                    const pVal = p.Value !== undefined ? p.Value : p.val;
                    if (pId && pVal !== undefined) {
                        core.setParameterValueById(pId, pVal); 
                    }
                });
            }
          }
        }, undefined, PIXI.UPDATE_PRIORITY.LOW);

        const stopDrag = () => { isDragging = false; };
        app.stage.on('pointerup', stopDrag);
        app.stage.on('pointerupoutside', stopDrag);

        const handleWheel = (e: WheelEvent) => {
          e.preventDefault();
          if (!model) return;
          const zoomFactor = -e.deltaY * 0.001;
          const newScale = Math.max(0.1, Math.min(currentScale * (1 + zoomFactor), currentScale * 8));
          (model as any).scale.set(newScale);
          currentScale = newScale;
        };

        if (containerRef.current) {
          containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
        }

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

  // Remove the strict blocking loading page to allow ref mounting
  // but keep loading state active for the overlays.

  return (
    <div className="min-h-screen bg-cottage-50 pt-24 overflow-hidden">
      <SectionHeader section="live2d" links={navLinks} />
      
      {/* Model Interaction Area */}
      <div className="relative w-full h-[calc(100vh-6rem)]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brown-900/40 backdrop-blur-sm z-50">
            <Loader2 className="w-12 h-12 text-peach-400 animate-spin mb-4" />
            <p className="text-peach-200 font-medium z-10 font-bold">Initializing Live2D Space...</p>
          </div>
        )}
        
        {!loading && !error && modelData?.model_url && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl z-10 pointer-events-none border border-peach-200 animate-slide-up">
            <div className="flex flex-col gap-2 text-sm text-brown-800 font-medium">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-peach-500" />
                <span><strong>Scroll</strong> to zoom in/out</span>
              </div>
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-peach-500" />
                <span><strong>Drag</strong> to move the model</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-peach-500" />
                <span><strong>Hover</strong> to track cursor</span>
              </div>
            </div>
          </div>
        )}

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
        
        {/* Expression Toggle Panel */}
        {expressions.length > 0 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl z-20 pointer-events-auto border border-peach-200 animate-slide-up flex flex-col gap-3 max-h-[80vh] overflow-y-auto w-48">
             <h3 className="font-bold text-brown-800 text-[13px] mb-1">VTuber Expressions</h3>
             <div className="flex flex-col gap-2">
                <button
                   onClick={() => {
                       setActiveExpression(null);
                       activeExpRef.current = null;
                   }}
                   className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                       activeExpression === null 
                         ? "bg-gradient-to-r from-sakura-400 to-peach-400 text-white shadow-md transform scale-105"
                         : "bg-cottage-100 text-brown-600 hover:bg-cottage-200"
                   }`}
                >
                   Neutral (Default)
                </button>
             
                {expressions.map((exp, idx) => (
                   <button
                       key={idx}
                       onClick={() => {
                           setActiveExpression(idx);
                           activeExpRef.current = idx;
                       }}
                       className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                           activeExpression === idx
                             ? "bg-gradient-to-r from-sakura-400 to-peach-400 text-white shadow-md transform scale-105"
                             : "bg-cottage-100 text-brown-600 hover:bg-cottage-200"
                       }`}
                   >
                       {exp.name}
                   </button>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
