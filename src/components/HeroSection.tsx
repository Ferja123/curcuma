import { Star, ShieldCheck, Leaf, Zap, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import EditableImage from './EditableImage';
import { IMAGES } from '../config/images';

export default function HeroSection() {
  const { setIsCartOpen } = useCart();

  return (
    <div className="relative bg-stone-50">
      <header className="absolute top-0 left-0 w-full z-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-amber-600" />
            <span className="font-serif text-2xl font-bold text-stone-800">NaturaVita</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="bg-white/80 backdrop-blur-md hover:bg-white text-stone-800 px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm flex items-center gap-2 border border-stone-200">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div 
            data-aos="fade-up"
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Más de 10,000 clientes satisfechos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-stone-900">
              Alivio natural y <span className="text-amber-600 italic">bienestar total</span> para tu cuerpo.
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
              Nuestra Cúrcuma Antiinflamatoria Premium está formulada con un 95% de curcuminoides y extracto de pimienta negra para una absorción 2000% mayor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsCartOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2">
                Comprar Ahora
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Garantía de 30 días</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span>100% Vegano</span>
              </div>
            </div>
          </div>

          <div 
            data-aos="zoom-in" data-aos-delay="200"
            className="relative"
          >
            <div className="absolute inset-0 bg-amber-200 rounded-full blur-3xl opacity-30 transform translate-x-10 translate-y-10"></div>
            <EditableImage 
              id="heroImage"
              initialSrc={IMAGES.curcumaPrincipal} 
              alt="Cúrcuma Antiinflamatoria Premium" 
              className="w-full h-auto rounded-2xl shadow-2xl relative z-10 object-cover aspect-[4/5] md:aspect-square" 
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-4 border border-stone-100">
              <div className="bg-amber-100 p-3 rounded-full">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">Absorción Rápida</p>
                <p className="text-xs text-stone-500">Con Bioperine®</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
