import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, X } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import SakuraPetals from "../../components/SakuraPetals";
import AdminLogin from "../../components/AdminLogin";
import { supabase, Live2DModel } from "../../lib/supabase";

export default function Live2DShowcase({ filter }: { filter?: string }) {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(filter || "All");
  const [selectedModel, setSelectedModel] = useState<Live2DModel | null>(null);
  const [models, setModels] = useState<Live2DModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, [filter]);

  useEffect(() => {
    if (filter) {
      setSelectedType(filter);
    } else {
      setSelectedType("All");
    }
  }, [filter]);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("live2d_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalizedData = (data || []).map((model) => {
        let actualType = model.type;
        const subTypes = ['fullbody', 'halfbody', 'vtuber', 'vtubers'];
        const isVtuber = subTypes.includes(model.type?.toLowerCase()?.trim());
        
        // We'll treat Animation as its own thing or if they want it under vtubers:
        // User requested: "fullbody,halfbody and animation are under vtubers"
        const isAnimation = model.type?.toLowerCase()?.trim() === 'animation';
        
        let features = Array.isArray(model.features) ? [...model.features] : [];
        if (isVtuber || isAnimation) {
           actualType = 'VTubers';
           if (!features.includes(model.type)) {
              features.push(model.type);
           }
        }
        
        return {
          ...model,
          type: actualType,
          features,
          rating: model.rating || 5,
        };
      });

      setModels(normalizedData);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const dbTypes = Array.from(new Set(models.map((m) => m.type)));
  const visibleTypes = dbTypes.filter(t => filter === 'NSFW' ? t === 'NSFW' : t !== 'NSFW');
  
  // Always ensure Vtubers and Animation are in the filter list for All Works
  if (filter !== 'NSFW') {
    if (!visibleTypes.includes('Vtubers')) visibleTypes.push('Vtubers');
    if (!visibleTypes.includes('Animation')) visibleTypes.push('Animation');
  }
  
  if (filter && !visibleTypes.includes(filter)) {
    visibleTypes.push(filter);
  }
  
  const types = filter === 'NSFW' ? [filter] : ["All", ...visibleTypes];

  const filteredModels =
    selectedType === "All"
      ? models.filter((m) => m.type !== "NSFW")
      : models.filter((m) => m.type === selectedType);

  const navLinks = [
    { label: "All Works", path: "/live2d" },
    { label: "NSFW", path: "/live2d/nsfw" },
    { label: "Inquire", path: "/live2d/contact" },
    { label: "Terms", path: "/live2d/tos" },
  ];

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;

    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
  };

  const renderThumbnail = (model: any) => {
     // If there is no explicit image, but there is a video, parse the video thumbnail!
     if (!model.image_url && model.video_url) {
         if (model.video_url.includes('youtube.com') || model.video_url.includes('youtu.be')) {
             const ytMatch = model.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
             const videoId = ytMatch ? ytMatch[1] : null;
             if (videoId) {
                 return <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={model.title} />;
             }
         }
         // Render the 0.1s frame of the MP4 native video
         return (
             <video 
                 src={`${model.video_url}#t=0.1`} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" 
                 muted 
                 playsInline
                 preload="metadata"
             />
         );
     }
     
     // Default image mapping
     return (
        <img
          src={model.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
          alt={model.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
     );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-cottage-50 to-sakura-50 relative">
      <SakuraPetals />
      <SectionHeader section="live2d" links={navLinks} />
      <AdminLogin />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">
              {selectedType === "All" ? "All Works" : selectedType}
            </h1>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto"></p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full transition-all font-medium ${
                  selectedType === type
                    ? "bg-gradient-to-r from-peach-400 to-cottage-400 text-white shadow-lg"
                    : "bg-white text-brown-700 hover:bg-cottage-100 border-2 border-cottage-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-peach-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-brown-600">Loading models...</p>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brown-600 text-lg">
                No models to display yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredModels.map((model, index) => (
                <div
                  key={model.id}
                  onClick={() => navigate(`/live2d/model/${model.id}`)}
                  className="group relative overflow-hidden rounded-2xl bg-white border-2 border-cottage-200 hover:border-peach-300 transition-all duration-500 cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-2xl animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square overflow-hidden relative">
                    {renderThumbnail(model)}
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-brown-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-peach-400 group-hover:bg-peach-500 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                        <Play
                          className="text-white ml-1"
                          fill="white"
                          size={24}
                        />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-peach-600 rounded-full shadow-md">
                        {model.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-brown-800 mb-1">
                      {model.title}
                    </h3>
                    <p className="text-peach-600 text-sm mb-3">
                      {model.client} • {model.year}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {model.type === "NSFW" && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full border border-red-200 font-bold">
                          NSFW
                        </span>
                      )}
                      {model.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-cottage-100 text-brown-700 rounded-full border border-cottage-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedModel && (
        <div
          className="fixed inset-0 z-50 bg-brown-900/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedModel(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-gradient-to-br from-cottage-50 to-peach-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-sakura-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedModel(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-brown-800 shadow-lg transition-all hover:scale-110"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-square overflow-hidden relative bg-brown-100">
                {selectedModel.video_url &&
                getVideoEmbedUrl(selectedModel.video_url) ? (
                  getVideoEmbedUrl(selectedModel.video_url)?.includes(
                    "youtube.com"
                  ) ? (
                    <iframe
                      src={getVideoEmbedUrl(selectedModel.video_url) || ""}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={getVideoEmbedUrl(selectedModel.video_url) || ""}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      loop
                    />
                  )
                ) : (
                  <img
                    src={selectedModel.image_url}
                    alt={selectedModel.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-brown-800 mb-2">
                  {selectedModel.title}
                </h2>
                <p className="text-peach-600 mb-6 font-medium">
                  {selectedModel.client} • {selectedModel.year}
                </p>

                <div className="mb-6 flex gap-3">
                  <span className="px-4 py-2 bg-peach-100 text-peach-700 border-2 border-peach-300 rounded-full text-sm font-semibold">
                    {selectedModel.type}
                  </span>
                  {selectedModel.type === "NSFW" && (
                    <span className="px-4 py-2 bg-red-100 text-red-700 border-2 border-red-300 rounded-full text-sm font-semibold animate-pulse">
                      NSFW
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-brown-800 mb-3">
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {selectedModel.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-sakura-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-sakura-400 rounded-full"></div>
                        </div>
                        <span className="text-brown-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => (window.location.href = "/live2d/contact")}
                    className="w-full cottagecore-btn-primary"
                  >
                    Request Similar Commission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
