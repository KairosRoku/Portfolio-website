import { useState } from 'react';
import { Mail, Clock, DollarSign, Send } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import SakuraPetals from '../../components/SakuraPetals';

export default function Live2DContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord: '',
    rigType: '',
    budget: '',
    deadline: '',
    hasArtwork: '',
    reference: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Commission form submitted:', formData);
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">Commission Inquiry</h1>
            <p className="text-brown-600 text-lg max-w-2xl mx-auto">
              Ready to bring your character to life? Fill out the form and I'll get back to you soon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-sakura-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-sakura-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brown-800 mb-2">Pricing</h3>
              <p className="text-brown-700 text-sm mb-2">Starting from $800</p>
              <p className="text-brown-600 text-xs">Varies by complexity</p>
            </div>

            <div className="p-6 bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-peach-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brown-800 mb-2">Timeline</h3>
              <p className="text-brown-700 text-sm mb-2">4-8 weeks</p>
              <p className="text-brown-600 text-xs">Depends on project scope</p>
            </div>

            <div className="p-6 bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-cottage-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="text-cottage-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brown-800 mb-2">Response Time</h3>
              <p className="text-brown-700 text-sm mb-2">Within 48 hours</p>
              <p className="text-brown-600 text-xs">Usually much faster</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="cottagecore-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="cottagecore-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Discord Username
                </label>
                <input
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="cottagecore-input"
                  placeholder="username#0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Rig Type
                </label>
                <select
                  value={formData.rigType}
                  onChange={(e) => setFormData({ ...formData, rigType: e.target.value })}
                  className="cottagecore-input"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="simple">Simple Rig</option>
                  <option value="half">Half Body</option>
                  <option value="full">Full Body</option>
                  <option value="custom">Custom / Not Sure</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="cottagecore-input"
                  placeholder="e.g., $800-$1500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Desired Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="cottagecore-input"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-brown-800 mb-2">
                Do you have artwork ready?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasArtwork"
                    value="yes"
                    onChange={(e) => setFormData({ ...formData, hasArtwork: e.target.value })}
                    className="text-sakura-500 focus:ring-sakura-400"
                  />
                  <span className="text-brown-700">Yes, I have artwork</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasArtwork"
                    value="no"
                    onChange={(e) => setFormData({ ...formData, hasArtwork: e.target.value })}
                    className="text-sakura-500 focus:ring-sakura-400"
                  />
                  <span className="text-brown-700">No, I need an artist</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-brown-800 mb-2">
                Reference Links
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="cottagecore-input"
                placeholder="Links to character art, inspiration, etc."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-brown-800 mb-2">
                Project Details
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="cottagecore-input min-h-[150px]"
                placeholder="Tell me about your character and what you envision..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full cottagecore-btn-primary flex items-center justify-center gap-2"
            >
              <Send size={20} />
              <span>Submit Commission Request</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
