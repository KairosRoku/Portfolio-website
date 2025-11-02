import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import SakuraPetals from '../../components/SakuraPetals';

export default function PhotographyContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    date: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">Get In Touch</h1>
            <p className="text-brown-600 text-lg max-w-2xl mx-auto">
              Let's discuss your photography needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-sakura-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="text-sakura-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brown-800 mb-2">Email</h3>
              <p className="text-brown-700 text-sm">hello@photography.com</p>
            </div>

            <div className="p-6 bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Phone className="text-peach-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brown-800 mb-2">Phone</h3>
              <p className="text-brown-700 text-sm">+1 (555) 123-4567</p>
            </div>

            <div className="p-6 bg-white/80 backdrop-blur-sm border-2 border-cottage-200 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-cottage-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MapPin className="text-cottage-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brown-800 mb-2">Location</h3>
              <p className="text-brown-700 text-sm">Los Angeles, CA</p>
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="cottagecore-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brown-800 mb-2">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="cottagecore-input"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="portrait">Portrait Session</option>
                  <option value="wedding">Wedding</option>
                  <option value="event">Event Photography</option>
                  <option value="commercial">Commercial Shoot</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-brown-800 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="cottagecore-input"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-brown-800 mb-2">
                Tell me about your project
                </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="cottagecore-input min-h-[150px]"
                placeholder="Share your vision and any specific requirements..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full cottagecore-btn-primary flex items-center justify-center gap-2"
            >
              <Send size={20} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
