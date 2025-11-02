import { useState } from 'react';
import { Check, ShoppingCart, X } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import SakuraPetals from '../../components/SakuraPetals';

interface PrintSize {
  id: string;
  name: string;
  dimensions: string;
  price: number;
  popular?: boolean;
}

interface PrintMaterial {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
}

interface Print {
  id: number;
  title: string;
  image: string;
  category: string;
}

export default function PhotographyOrdering() {
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const printSizes: PrintSize[] = [
    { id: '8x10', name: '8" × 10"', dimensions: '20cm × 25cm', price: 45 },
    { id: '11x14', name: '11" × 14"', dimensions: '28cm × 36cm', price: 65, popular: true },
    { id: '16x20', name: '16" × 20"', dimensions: '41cm × 51cm', price: 95, popular: true },
    { id: '20x30', name: '20" × 30"', dimensions: '51cm × 76cm', price: 145 },
    { id: '24x36', name: '24" × 36"', dimensions: '61cm × 91cm', price: 195 },
    { id: '30x40', name: '30" × 40"', dimensions: '76cm × 102cm', price: 295 },
  ];

  const printMaterials: PrintMaterial[] = [
    {
      id: 'fine-art',
      name: 'Fine Art Paper',
      description: 'Premium museum-quality matte paper',
      priceModifier: 1.0,
    },
    {
      id: 'canvas',
      name: 'Canvas Print',
      description: 'Gallery-wrapped canvas with wooden frame',
      priceModifier: 1.5,
    },
    {
      id: 'metal',
      name: 'Metal Print',
      description: 'Vibrant aluminum with glossy finish',
      priceModifier: 2.0,
    },
    {
      id: 'wood',
      name: 'Wood Print',
      description: 'Natural wood grain texture shows through',
      priceModifier: 1.8,
    },
    {
      id: 'acrylic',
      name: 'Acrylic Glass',
      description: 'Ultra-modern with depth and shine',
      priceModifier: 2.5,
    },
  ];

  const availablePrints: Print[] = [
    {
      id: 1,
      title: 'Golden Hour Cityscape',
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Urban',
    },
    {
      id: 2,
      title: 'Mountain Wilderness',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Nature',
    },
    {
      id: 3,
      title: 'Sunset Over Ocean',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Nature',
    },
    {
      id: 4,
      title: 'Urban Night Lights',
      image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Urban',
    },
    {
      id: 5,
      title: 'Architectural Marvel',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Architecture',
    },
    {
      id: 6,
      title: 'Abstract Reflections',
      image: 'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Abstract',
    },
  ];

  const navLinks = [
    { label: 'Portfolio', path: '/photography/showcase' },
    { label: 'Order', path: '/photography/ordering' },
    { label: 'Contact', path: '/photography/contact' },
  ];

  const calculateTotal = () => {
    const size = printSizes.find((s) => s.id === selectedSize);
    const material = printMaterials.find((m) => m.id === selectedMaterial);
    if (!size || !material) return 0;
    return Math.round(size.price * material.priceModifier * quantity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-50 via-peach-50 to-cottage-50 relative">
      <SakuraPetals />
      <SectionHeader section="photography" links={navLinks} />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">
              Order Prints
            </h1>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              Museum-quality prints crafted with care and delivered to your door
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {availablePrints.map((print, index) => (
              <div
                key={print.id}
                onClick={() => {
                  setSelectedPrint(print);
                  setSelectedSize('');
                  setSelectedMaterial('');
                }}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 cursor-pointer hover:scale-[1.02] border-2 animate-slide-up ${
                  selectedPrint?.id === print.id
                    ? 'border-sakura-400 ring-4 ring-sakura-200'
                    : 'border-cottage-200 hover:border-sakura-300'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={print.image}
                    alt={print.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-brown-800 mb-1">{print.title}</h3>
                  <p className="text-sakura-600 text-sm">{print.category}</p>
                </div>

                {selectedPrint?.id === print.id && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-sakura-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check size={20} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPrint && (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-brown-800 mb-8">Configure Your Print</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-brown-800 mb-4">Select Size</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {printSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                            selectedSize === size.id
                              ? 'border-sakura-400 bg-sakura-50 ring-2 ring-sakura-200'
                              : 'border-cottage-200 hover:border-cottage-300 bg-white'
                          }`}
                        >
                          {size.popular && (
                            <div className="absolute -top-2 right-4">
                              <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-sakura-400 to-peach-400 text-white rounded-full shadow-md">
                                Popular
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-lg font-semibold text-brown-800">{size.name}</p>
                              <p className="text-sm text-brown-600">{size.dimensions}</p>
                            </div>
                            <p className="text-2xl font-bold text-sakura-600">${size.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-brown-800 mb-4">Select Material</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {printMaterials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => setSelectedMaterial(material.id)}
                          className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                            selectedMaterial === material.id
                              ? 'border-peach-400 bg-peach-50 ring-2 ring-peach-200'
                              : 'border-cottage-200 hover:border-cottage-300 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-lg font-semibold text-brown-800">{material.name}</p>
                              <p className="text-sm text-brown-600">{material.description}</p>
                            </div>
                            <span className="text-sm font-medium text-peach-600 whitespace-nowrap ml-4">
                              ×{material.priceModifier}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-brown-800 mb-4">Quantity</h3>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 bg-cottage-200 hover:bg-cottage-300 text-brown-800 rounded-full font-semibold transition-all hover:scale-110"
                      >
                        −
                      </button>
                      <span className="text-3xl font-bold text-brown-800 w-16 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 bg-cottage-200 hover:bg-cottage-300 text-brown-800 rounded-full font-semibold transition-all hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-32 bg-gradient-to-br from-cottage-50 to-peach-50 border-2 border-cottage-300 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-brown-800 mb-4">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-brown-700">
                        <span>Print:</span>
                        <span className="font-medium text-right">{selectedPrint.title}</span>
                      </div>
                      {selectedSize && (
                        <div className="flex justify-between text-brown-700">
                          <span>Size:</span>
                          <span className="font-medium">
                            {printSizes.find((s) => s.id === selectedSize)?.name}
                          </span>
                        </div>
                      )}
                      {selectedMaterial && (
                        <div className="flex justify-between text-brown-700">
                          <span>Material:</span>
                          <span className="font-medium text-right">
                            {printMaterials.find((m) => m.id === selectedMaterial)?.name}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-brown-700">
                        <span>Quantity:</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                      {selectedSize && selectedMaterial && (
                        <div className="pt-3 border-t-2 border-cottage-300 flex justify-between">
                          <span className="text-lg font-semibold text-brown-800">Total:</span>
                          <span className="text-3xl font-bold text-sakura-600">
                            ${calculateTotal()}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      disabled={!selectedSize || !selectedMaterial}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium transition-all ${
                        selectedSize && selectedMaterial
                          ? 'cottagecore-btn-primary cursor-pointer'
                          : 'bg-cottage-200 text-cottage-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={20} />
                      <span>Add to Cart</span>
                    </button>

                    <div className="mt-6 space-y-3 text-sm text-brown-600">
                      <p className="flex items-start gap-2">
                        <Check size={16} className="text-sakura-500 flex-shrink-0 mt-0.5" />
                        <span>Museum-quality archival materials</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Check size={16} className="text-sakura-500 flex-shrink-0 mt-0.5" />
                        <span>Professional color calibration</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Check size={16} className="text-sakura-500 flex-shrink-0 mt-0.5" />
                        <span>Secure packaging & shipping</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Check size={16} className="text-sakura-500 flex-shrink-0 mt-0.5" />
                        <span>Certificate of authenticity included</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
