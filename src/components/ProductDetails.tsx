import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { setIsCartOpen } = useCart();

  return (
    <section className="py-20 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-stone-200 p-12 flex items-center justify-center">
            <img src="/curcuma-principal.jpg" alt="Frasco de Cúrcuma" className="w-full max-w-md rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500" loading="lazy" decoding="async" />
          </div>
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold mb-6 w-max">
              Fórmula Mejorada
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
              Cúrcuma Premium + Bioperine®
            </h2>
            <p className="text-stone-600 mb-8 text-lg">
              Cada cápsula contiene 1500mg de raíz de cúrcuma orgánica y 95% de curcuminoides estandarizados, garantizando la máxima potencia y eficacia.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Alivia el dolor articular y muscular",
                "Mejora la digestión y reduce la hinchazón",
                "Potente antioxidante natural",
                "Apoya la salud cardiovascular"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-stone-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-8 border-t border-stone-100">
              <div>
                <p className="text-sm text-stone-500 line-through">$49.99</p>
                <p className="text-3xl font-bold text-stone-900">$29.99</p>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
