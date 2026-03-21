import { useCart } from '../context/CartContext';

export default function ShopifyProducts() {
  const { setIsCartOpen } = useCart();

  const products = [
    { title: "1 Frasco", subtitle: "Suministro para 1 mes", price: "$29.99", oldPrice: "$49.99", popular: false },
    { title: "3 Frascos", subtitle: "Suministro para 3 meses", price: "$69.99", oldPrice: "$149.97", popular: true, savings: "Ahorras $80" },
    { title: "6 Frascos", subtitle: "Suministro para 6 meses", price: "$119.99", oldPrice: "$299.94", popular: false, savings: "Ahorras $180" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Elige tu Paquete</h2>
          <p className="text-stone-600">Ahorra más comprando para varios meses.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((pkg, idx) => (
            <div key={idx} className={`relative bg-white rounded-3xl border-2 p-8 flex flex-col ${pkg.popular ? 'border-amber-500 shadow-xl scale-105 z-10' : 'border-stone-100 shadow-sm'}`}>
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Más Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-stone-900 text-center mb-2">{pkg.title}</h3>
              <p className="text-stone-500 text-center mb-6">{pkg.subtitle}</p>
              
              <div className="text-center mb-8">
                <p className="text-stone-400 line-through text-lg">{pkg.oldPrice}</p>
                <p className="text-4xl font-bold text-stone-900">{pkg.price}</p>
                {pkg.savings && <p className="text-emerald-600 font-medium mt-2">{pkg.savings}</p>}
              </div>

              <button onClick={() => setIsCartOpen(true)} className={`mt-auto w-full py-4 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-900'}`}>
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
