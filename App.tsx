import React, { useState } from 'react';
import { AgentInterface } from './components/AgentInterface';
import { SERVICES, PRICING_PACKAGES } from './constants';
import { AgentType } from './types';
import { Camera, Video, Monitor, Box, MapPin, Share2, Menu, X, CheckCircle, ChevronRight, Phone } from 'lucide-react';

// Icon mapping helper
const getIcon = (name: string) => {
  switch (name) {
    case 'camera': return <Camera className="w-8 h-8 text-brand-accent" />;
    case 'video': return <Video className="w-8 h-8 text-brand-accent" />;
    case 'box': return <Box className="w-8 h-8 text-brand-accent" />;
    case 'plane': return <MapPin className="w-8 h-8 text-brand-accent" />; // Using MapPin as proxy for location/drone
    case 'globe': return <Monitor className="w-8 h-8 text-brand-accent" />;
    case 'share': return <Share2 className="w-8 h-8 text-brand-accent" />;
    default: return <Camera className="w-8 h-8 text-brand-accent" />;
  }
};

const App: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentType>(AgentType.FRONT_DESK);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-white">UP<span className="text-brand-accent">CA</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
              <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#demo" className="px-5 py-2 rounded-full bg-brand-accent text-brand-dark font-semibold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/20">
                Try AI Agent
              </a>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-4">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-slate-300">About</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-slate-300">Services</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-slate-300">Pricing</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-lg bg-brand-accent text-brand-dark font-bold">
              Try AI Agent
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Now Featuring AI Dispatch
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Elevate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-200">Real Estate</span> Media.
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                Premium HDR photography, cinematic video, and 3D tours delivered by the next morning. 
                Experience the future of booking with our AI assistants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#services" className="px-8 py-4 rounded-xl bg-white text-brand-dark font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                  View Services
                </a>
                <a href="#demo" className="px-8 py-4 rounded-xl bg-slate-800 text-white font-medium border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                  <Phone size={20} />
                  Call AI Demo
                </a>
              </div>
            </div>
            
            {/* Hero Image / Video Placeholder */}
            <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                    <img 
                      src="https://picsum.photos/800/600?grayscale" 
                      alt="Modern Interior" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent flex flex-col justify-end p-8">
                        <p className="text-brand-accent font-medium">Luxury Collection</p>
                        <p className="text-white text-xl font-bold">123 Skyline Ave, Toronto</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to market a listing from start to finish. High quality, fast turnaround.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="group p-8 rounded-2xl bg-brand-dark border border-slate-800 hover:border-brand-accent/50 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 rounded-xl bg-slate-800 group-hover:bg-brand-accent/10 transition-colors">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-slate-500">Starting at {service.priceStart}</span>
                  <span className="text-brand-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section id="demo" className="py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark to-slate-900"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Talk to our <br/>
                <span className="text-brand-accent">AI Staff</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Experience the future of agency management. Test our two AI agents powered by Gemini 2.5.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-brand-accent font-bold">1</div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Front Desk (Sarah)</h4>
                    <p className="text-slate-400">Ask about our photography packages, pricing, or how to book a shoot. She is calm and detailed.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                   <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-red-500 font-bold">2</div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Dispatch (Mike)</h4>
                    <p className="text-slate-400">Simulate a rush request. Tell him you need photos tomorrow morning at 6 AM. He is fast and focused.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Interface */}
            <div className="flex flex-col items-center">
               <AgentInterface selectedAgentId={selectedAgentId} onAgentChange={setSelectedAgentId} />
               <p className="mt-6 text-sm text-slate-500 text-center max-w-sm">
                 *Requires microphone permission. The AI uses the Gemini Live API for real-time low-latency voice interaction.
               </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-slate-400">No hidden fees. Download photos anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PACKAGES.map((pkg, idx) => (
              <div key={pkg.name} className={`relative p-8 rounded-2xl border ${idx === 1 ? 'bg-slate-800 border-brand-accent shadow-2xl shadow-brand-accent/10 transform md:-translate-y-4' : 'bg-brand-dark border-slate-800'} flex flex-col`}>
                {idx === 1 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-accent text-brand-dark text-xs font-bold uppercase tracking-wide py-1 px-3 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-white mb-6">{pkg.price}</div>
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-brand-accent flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-bold transition-all ${idx === 1 ? 'bg-brand-accent text-brand-dark hover:bg-yellow-400' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-white block mb-4">UP<span className="text-brand-accent">CA</span></span>
              <p className="text-slate-400 max-w-sm mb-6">
                Redefining real estate media with technology and creativity. 
                Based in Canada, serving top brokers since 2020.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-brand-accent">About Us</a></li>
                <li><a href="#" className="hover:text-brand-accent">Careers</a></li>
                <li><a href="#" className="hover:text-brand-accent">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-brand-accent">Contact</a></li>
                <li><a href="#" className="hover:text-brand-accent">FAQ</a></li>
                <li><a href="#" className="hover:text-brand-accent">Booking Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} UPCA Media. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
