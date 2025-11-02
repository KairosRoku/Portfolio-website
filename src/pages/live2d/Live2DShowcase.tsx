import { useState } from 'react';
import { Play, Star, X } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import SakuraPetals from '../../components/SakuraPetals';

interface Model {
  id: number;
  title: string;
  client: string;
  type: string;
  image: string;
  features: string[];
  rating: number;
  year: string;
}

export default function Live2DShowcase() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const models: Model[] = [
    {
      id: 1,
      title: 'Ethereal Mage VTuber',
      client: 'StreamerName',
      type: 'Full Rig',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Full body rigging', 'Advanced physics', 'Facial tracking', 'Eye tracking', 'Custom expressions'],
      rating: 5,
      year: '2024'
    },
    {
      id: 2,
      title: 'Cyberpunk Character',
      client: 'GamingChannel',
      type: 'Half Body',
      image: 'https://images.pexels.com/photos/5207262/pexels-photo-5207262.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Half body rig', 'Hair physics', 'Expression set', 'Breathing animation'],
      rating: 5,
      year: '2024'
    },
    {
      id: 3,
      title: 'Fantasy Warrior Avatar',
      client: 'Content Creator',
      type: 'Full Rig',
      image: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Full body rigging', 'Weapon physics', 'Battle expressions', 'Dynamic movement'],
      rating: 5,
      year: '2023'
    },
    {
      id: 4,
      title: 'Cute Mascot Character',
      client: 'Brand Mascot',
      type: 'Simple Rig',
      image: 'https://images.pexels.com/photos/7234394/pexels-photo-7234394.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Basic rigging', 'Bounce physics', 'Simple expressions', 'Idle animation'],
      rating: 4,
      year: '2023'
    },
    {
      id: 5,
      title: 'Anime Idol VTuber',
      client: 'Idol Group',
      type: 'Full Rig',
      image: 'https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Performance ready', 'Stage lighting support', 'Dancing animations', 'Lip sync'],
      rating: 5,
      year: '2024'
    },
    {
      id: 6,
      title: 'Mysterious Sorcerer',
      client: 'RPG Streamer',
      type: 'Half Body',
      image: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Upper body rig', 'Cloak physics', 'Magic effects', 'Hand gestures'],
      rating: 5,
      year: '2023'
    }
  ];

  const types = ['All', ...Array.from(new Set(models.map(m => m.type)))];

  const filteredModels = selectedType === 'All'
    ? models
    : models.filter(m => m.type === selectedType);

  const navLinks = [
    { label: 'Showcase', path: '/live2d/showcase' },
    { label: 'Contact', path: '/live2d/contact' },
    { label: 'Terms', path: '/live2d/tos' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-cottage-50 to-sakura-50 relative">
      <SakuraPetals />
      <SectionHeader section="live2d" links={navLinks} />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">
              Model Showcase
            </h1>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              Bringing characters to life through artistry and animation
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full transition-all font-medium ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-peach-400 to-cottage-400 text-white shadow-lg'
                    : 'bg-white text-brown-700 hover:bg-cottage-100 border-2 border-cottage-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model, index) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-cottage-200 hover:border-peach-300 transition-all duration-500 cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={model.image}
                    alt={model.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-brown-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-peach-400 group-hover:bg-peach-500 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="text-white ml-1" fill="white" size={24} />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-peach-600 rounded-full shadow-md">
                      {model.type}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-1">
                    {Array.from({ length: model.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-sakura-400" fill="currentColor" />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brown-800 mb-1">{model.title}</h3>
                  <p className="text-peach-600 text-sm mb-3">{model.client} • {model.year}</p>
                  <div className="flex flex-wrap gap-2">
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
                <img
                  src={selectedModel.image}
                  alt={selectedModel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-peach-500 hover:bg-peach-600 flex items-center justify-center transition-all shadow-2xl hover:scale-110">
                    <Play className="text-white ml-1" fill="white" size={32} />
                  </button>
                </div>
              </div>

              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: selectedModel.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-sakura-400" fill="currentColor" />
                  ))}
                </div>
                <h2 className="text-3xl font-bold text-brown-800 mb-2">{selectedModel.title}</h2>
                <p className="text-peach-600 mb-6 font-medium">{selectedModel.client} • {selectedModel.year}</p>

                <div className="mb-6">
                  <span className="px-4 py-2 bg-peach-100 text-peach-700 border-2 border-peach-300 rounded-full text-sm font-semibold">
                    {selectedModel.type}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-brown-800 mb-3">Features</h3>
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
                  <button className="w-full cottagecore-btn-primary">
                    Request Similar Commission
                  </button>
                  <button className="w-full cottagecore-btn-secondary">
                    Download Demo Video
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
