import { Star } from 'lucide-react';

export default function ReviewsSection() {
  const reviews = [
    { name: "María G.", text: "Llevo 2 meses tomándola y el dolor en mis rodillas ha disminuido notablemente. ¡Totalmente recomendada!", rating: 5 },
    { name: "Carlos R.", text: "Excelente producto. He probado otras marcas pero esta es la única que realmente me ha funcionado para la inflamación.", rating: 5 },
    { name: "Elena M.", text: "Me siento con más energía y mis digestiones han mejorado muchísimo. Ya voy por mi tercer frasco.", rating: 5 },
  ];

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-12 text-center">Lo que dicen nuestros clientes</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-stone-700 italic mb-6">"{review.text}"</p>
              <p className="font-bold text-stone-900">{review.name}</p>
              <p className="text-sm text-stone-500">Comprador Verificado</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
