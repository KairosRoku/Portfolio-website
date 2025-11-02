import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Gamepad2 } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen flex overflow-hidden">
      <div
        className={`group relative transition-all duration-700 ease-out flex items-center justify-center cursor-pointer ${
          hoveredSection === 'photography'
            ? 'w-full'
            : hoveredSection
            ? 'w-0 opacity-0'
            : 'w-1/3'
        }`}
        onMouseEnter={() => setHoveredSection('photography')}
        onMouseLeave={() => setHoveredSection(null)}
        onClick={() => navigate('/photography')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sakura-100 via-peach-50 to-cottage-50"></div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sakura-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-peach-300 rounded-full blur-3xl"></div>
        </div>

        <div className={`relative z-10 text-center px-6 transition-all duration-700 ${
          hoveredSection === 'photography' ? 'scale-110' : 'scale-100'
        }`}>
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-white/80 backdrop-blur-sm rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
            <Camera className="text-sakura-500" size={40} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-brown-800">
            Photography
          </h2>
          <p className="text-lg md:text-xl text-brown-600 max-w-md mx-auto">
            Capturing life's beautiful moments through the lens
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brown-300 to-transparent"></div>
      </div>

      <div
        className={`group relative transition-all duration-700 ease-out flex items-center justify-center cursor-pointer ${
          hoveredSection === 'live2d'
            ? 'w-full'
            : hoveredSection
            ? 'w-0 opacity-0'
            : 'w-1/3'
        }`}
        onMouseEnter={() => setHoveredSection('live2d')}
        onMouseLeave={() => setHoveredSection(null)}
        onClick={() => navigate('/live2d')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-peach-50 via-cottage-50 to-sakura-100"></div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-cottage-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-sakura-300 rounded-full blur-3xl"></div>
        </div>

        <div className={`relative z-10 text-center px-6 transition-all duration-700 ${
          hoveredSection === 'live2d' ? 'scale-110' : 'scale-100'
        }`}>
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-white/80 backdrop-blur-sm rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
            <Sparkles className="text-peach-500" size={40} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-brown-800">
            Live2D
          </h2>
          <p className="text-lg md:text-xl text-brown-600 max-w-md mx-auto">
            Bringing characters to life with animation magic
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brown-300 to-transparent"></div>
      </div>

      <div
        className={`group relative transition-all duration-700 ease-out flex items-center justify-center cursor-pointer ${
          hoveredSection === 'gamedev'
            ? 'w-full'
            : hoveredSection
            ? 'w-0 opacity-0'
            : 'w-1/3'
        }`}
        onMouseEnter={() => setHoveredSection('gamedev')}
        onMouseLeave={() => setHoveredSection(null)}
        onClick={() => navigate('/gamedev')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cottage-50 via-sakura-50 to-peach-50"></div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-peach-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cottage-300 rounded-full blur-3xl"></div>
        </div>

        <div className={`relative z-10 text-center px-6 transition-all duration-700 ${
          hoveredSection === 'gamedev' ? 'scale-110' : 'scale-100'
        }`}>
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-white/80 backdrop-blur-sm rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
            <Gamepad2 className="text-brown-500" size={40} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-brown-800">
            Game Dev
          </h2>
          <p className="text-lg md:text-xl text-brown-600 max-w-md mx-auto">
            Creating interactive experiences and digital worlds
          </p>
        </div>
      </div>
    </section>
  );
}
