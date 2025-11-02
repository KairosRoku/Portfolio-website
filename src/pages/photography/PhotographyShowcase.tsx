import { useState } from 'react';
import { X } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import SakuraPetals from '../../components/SakuraPetals';

interface Photo {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
}

export default function PhotographyShowcase() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const photos: Photo[] = [
    {
      id: 1,
      title: 'Golden Hour Cityscape',
      description: 'Urban beauty bathed in warm sunset light',
      category: 'Urban',
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      title: 'Portrait in Natural Light',
      description: 'Soft, elegant portraiture capturing genuine emotion',
      category: 'Portrait',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 3,
      title: 'Mountain Wilderness',
      description: 'Majestic peaks under vast open skies',
      category: 'Nature',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 4,
      title: 'Abstract Reflections',
      description: 'Playing with light, shadow, and geometry',
      category: 'Abstract',
      image: 'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 5,
      title: 'Street Life',
      description: 'Candid moments in the heart of the city',
      category: 'Street',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 6,
      title: 'Architectural Marvel',
      description: 'Modern design meets timeless elegance',
      category: 'Architecture',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 7,
      title: 'Sunset Over Ocean',
      description: 'Where sky and sea become one',
      category: 'Nature',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 8,
      title: 'Urban Night Lights',
      description: 'City energy captured after dark',
      category: 'Urban',
      image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 9,
      title: 'Fashion Editorial',
      description: 'Style and sophistication in every frame',
      category: 'Portrait',
      image: 'https://images.pexels.com/photos/1229896/pexels-photo-1229896.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const navLinks = [
    { label: 'Portfolio', path: '/photography/showcase' },
    { label: 'Order', path: '/photography/ordering' },
    { label: 'Contact', path: '/photography/contact' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-50 via-peach-50 to-cottage-50 relative">
      <SakuraPetals />
      <SectionHeader section="photography" links={navLinks} />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">
              Portfolio
            </h1>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              A curated collection of moments frozen in time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02] animate-slide-up border-2 border-cottage-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{photo.title}</h3>
                    <p className="text-peach-100 text-sm">{photo.description}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-sakura-600 rounded-full shadow-md">
                    {photo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-brown-900/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-6xl w-full bg-gradient-to-br from-cottage-50 to-peach-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-sakura-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-brown-800 shadow-lg transition-all hover:scale-110"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-square overflow-hidden bg-brown-100">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="px-4 py-2 bg-sakura-100 text-sakura-700 rounded-full text-sm font-semibold">
                    {selectedPhoto.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-brown-800 mb-4">
                  {selectedPhoto.title}
                </h2>
                <p className="text-lg text-brown-600 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
