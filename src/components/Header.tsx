import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, ShoppingCart } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Inicio', id: 'top' },
    { name: 'Beneficios', id: 'beneficios' },
    { name: 'Análisis Biológico', id: 'analisis' },
    { name: 'Testimonios', id: 'testimonios' },
    { name: 'Preguntas Frecuentes', id: 'faq' },
  ];

  return (
    <>
      <header 
        className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection('top')}
            >
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                Supralab
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('formulario-compra')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5"
              >
                Comprar Ahora
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900">
                Supralab
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="w-full text-left px-4 py-4 rounded-xl text-lg font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Drawer Footer / CTA */}
          <div className="p-6 border-t border-slate-100">
            <button 
              onClick={() => scrollToSection('formulario-compra')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
