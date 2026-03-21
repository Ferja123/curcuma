import { ShieldCheck, Zap, Leaf } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-600" />,
      title: "Potente Antiinflamatorio",
      desc: "Ayuda a reducir la inflamación en las articulaciones y mejora la movilidad diaria de forma natural."
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      title: "Absorción Superior",
      desc: "Formulada con extracto de pimienta negra que aumenta la absorción de la curcumina hasta en un 2000%."
    },
    {
      icon: <Leaf className="w-8 h-8 text-amber-600" />,
      title: "Ingredientes Puros",
      desc: "Cúrcuma 100% orgánica, sin aditivos artificiales, gluten ni conservantes. Apto para veganos."
    }
  ];

  return (
    <section className="bg-stone-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">¿Por qué elegir nuestra Cúrcuma Premium?</h2>
          <p className="text-stone-600">No todas las cúrcumas son iguales. Nuestra fórmula está diseñada científicamente para maximizar los beneficios antiinflamatorios.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
