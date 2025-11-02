import { useState } from 'react';
import { ExternalLink, X, Calendar, Users } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import SakuraPetals from '../../components/SakuraPetals';

interface Game {
  id: number;
  title: string;
  genre: string;
  description: string;
  image: string;
  tech: string[];
  year: string;
  players: string;
}

export default function GameDevShowcase() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const games: Game[] = [
    {
      id: 1,
      title: 'Neon Runner',
      genre: 'Action Platformer',
      description: 'Fast-paced cyberpunk platformer with fluid movement mechanics',
      image: 'https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Unity', 'C#', '2D'],
      year: '2023',
      players: 'Single Player',
    },
    {
      id: 2,
      title: 'Mystic Realms',
      genre: 'RPG Adventure',
      description: 'Story-driven RPG with dynamic combat and branching narratives',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Unreal Engine', 'Blueprint', '3D'],
      year: '2025',
      players: 'Single Player',
    },
    {
      id: 3,
      title: 'Puzzle Nexus',
      genre: 'Puzzle Strategy',
      description: 'Mind-bending puzzles that blend logic with spatial reasoning',
      image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Godot', 'GDScript', '2D'],
      year: '2022',
      players: 'Single Player',
    },
    {
      id: 4,
      title: 'Stellar Voyage',
      genre: 'Space Exploration',
      description: 'Open-world space exploration with procedural generation',
      image: 'https://images.pexels.com/photos/2471171/pexels-photo-2471171.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Unity', 'C#', '3D'],
      year: 'TBA',
      players: 'Single Player',
    },
    {
      id: 5,
      title: 'Shadow Tactics',
      genre: 'Stealth Strategy',
      description: 'Tactical stealth game with real-time strategy elements',
      image: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Unity', 'C#', '3D'],
      year: '2023',
      players: 'Single Player',
    },
    {
      id: 6,
      title: 'Rhythm Clash',
      genre: 'Rhythm Action',
      description: 'Music-driven combat where every beat matters',
      image: 'https://images.pexels.com/photos/3761504/pexels-photo-3761504.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Unity', 'C#', '2D'],
      year: '2024',
      players: 'Single/Multiplayer',
    },
  ];

  const navLinks = [{ label: 'Back', path: '/' }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cottage-50 via-sakura-50 to-peach-50 relative">
      <SakuraPetals />
      <SectionHeader section="gamedev" links={navLinks} />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">
              Game Portfolio
            </h1>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              Interactive experiences crafted with passion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-cottage-200 hover:border-brown-300 transition-all duration-500 cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brown-800 mb-1">{game.title}</h3>
                  <p className="text-brown-600 text-sm font-medium mb-3">{game.genre}</p>
                  <p className="text-brown-700 text-sm mb-4 leading-relaxed">{game.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {game.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs font-medium bg-cottage-100 text-brown-700 rounded-full border border-cottage-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedGame && (
        <div
          className="fixed inset-0 z-50 bg-brown-900/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-gradient-to-br from-cottage-50 to-peach-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-brown-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-brown-800 shadow-lg transition-all hover:scale-110"
            >
              <X size={24} />
            </button>

            <div className="aspect-video overflow-hidden bg-brown-100">
              <img
                src={selectedGame.image}
                alt={selectedGame.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <div className="mb-4">
                <span className="px-4 py-2 bg-brown-100 text-brown-700 border-2 border-brown-300 rounded-full text-sm font-semibold">
                  {selectedGame.genre}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-brown-800 mb-4">{selectedGame.title}</h2>
              <p className="text-lg text-brown-700 leading-relaxed mb-6">{selectedGame.description}</p>

              <div className="flex items-center gap-6 mb-6 text-brown-700">
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {selectedGame.year}
                </span>
                <span className="flex items-center gap-2">
                  <Users size={18} />
                  {selectedGame.players}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brown-800 mb-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedGame.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white border-2 border-cottage-200 text-brown-700 rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 cottagecore-btn-primary">
                <ExternalLink size={20} />
                <span>View Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
