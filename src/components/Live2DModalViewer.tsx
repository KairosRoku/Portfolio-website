import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Loader2, MousePointerClick, Move, ZoomIn } from 'lucide-react';

(window as any).PIXI = PIXI;

interface Live2DViewerProps {
  modelUrl: string;
}

export default function Live2DModalViewer({ modelUrl }: Live2DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    if (!(window as any).Live2DCubismCore) {
      setError('Live2DCubismCore is not loaded. Please refresh the page.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    const app = new PIXI.Application({
      resizeTo: containerRef.current,
      backgroundAlpha: 0,
    });
    
    app.view.style.position = 'absolute';
    app.view.style.top = '0';
    app.view.style.left = '0';
    app.view.style.width = '100%';
    app.view.style.height = '100%';
    app.view.style.touchAction = 'none'; // Essential for mobile drag/pinch
    containerRef.current.appendChild(app.view as any);

    let model: any = null;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let modelStartPos = { x: 0, y: 0 };
    let currentScale = 1;

    const initModel = async () => {
      try {
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');
        if (!isMounted) return;

        model = await Live2DModel.from(modelUrl);
        if (!isMounted) return;

        app.stage.addChild(model);
        
        const resetLayout = () => {
          if (!model) return;
          const cw = containerRef.current?.clientWidth || 800;
          const ch = containerRef.current?.clientHeight || 800;
          const mw = model.width || 1000;
          const mh = model.height || 1000;
          
          currentScale = Math.min(cw / mw, ch / mh) * 0.9;
          model.scale.set(currentScale);
          
          // Center model dynamically based on its anchor support
          if ('anchor' in model) {
             model.anchor.set(0.5, 0.5);
             model.x = cw / 2;
             model.y = (ch / 2) + (ch * 0.1);
          } else {
             model.x = (cw - mw * currentScale) / 2;
             model.y = ((ch - mh * currentScale) / 2) + (ch * 0.1);
          }
        };

        resetLayout();
        window.addEventListener('resize', resetLayout);

        // Interaction for moving the model
        app.stage.interactive = true;
        app.stage.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);
        
        app.stage.on('pointerdown', (e: any) => {
          isDragging = true;
          dragStart = { x: e.data.global.x, y: e.data.global.y };
          modelStartPos = { x: model.x, y: model.y };
        });

        app.stage.on('pointermove', (e: any) => {
          if (isDragging) {
            const dx = e.data.global.x - dragStart.x;
            const dy = e.data.global.y - dragStart.y;
            model.x = modelStartPos.x + dx;
            model.y = modelStartPos.y + dy;
          } else {
            // Track cursor movement when not dragging
            if (model.focus) {
               model.focus(e.data.global.x, e.data.global.y);
            }
          }
        });

        const stopDrag = () => { isDragging = false; };
        app.stage.on('pointerup', stopDrag);
        app.stage.on('pointerupoutside', stopDrag);
        
        // Zoom functionality via wheel event on the container
        const handleWheel = (e: WheelEvent) => {
          e.preventDefault();
          if (!model) return;
          
          const zoomFactor = -e.deltaY * 0.001;
          const newScale = Math.max(0.1, Math.min(currentScale * (1 + zoomFactor), currentScale * 6));
          model.scale.set(newScale);
          currentScale = newScale;
        };

        containerRef.current?.addEventListener('wheel', handleWheel, { passive: false });

        setLoading(false);
      } catch (err: any) {
        console.error("Live2D Load Error:", err);
        setError("Failed to load VTuber assets. Ensure model format is supported.");
        setLoading(false);
      }
    };

    initModel();

    return () => {
      isMounted = false;
      if (containerRef.current && app.view.parentNode === containerRef.current) {
         containerRef.current.removeChild(app.view as HTMLCanvasElement);
      }
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [modelUrl]);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden rounded-xl" ref={containerRef}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brown-200/50 backdrop-blur-sm z-20">
          <Loader2 className="w-12 h-12 text-peach-500 animate-spin mb-4" />
          <p className="text-brown-700 font-semibold z-10 px-4 text-center">Loading Virtual Avatar...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-100/90 text-red-700 p-6 text-center font-bold border-4 border-red-300 rounded-xl">
          {error}
        </div>
      )}

      {/* Instructions Overlay */}
      {!loading && !error && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl z-10 pointer-events-none border border-peach-200 animate-slide-up">
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
    </div>
  );
}
