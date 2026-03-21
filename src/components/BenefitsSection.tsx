import { Activity, Heart, Brain, Lightbulb, Shield } from 'lucide-react';

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Beneficios Integrales</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">Descubre cómo nuestra fórmula premium puede transformar diferentes aspectos de tu salud diaria.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Activity className="w-10 h-10 text-amber-600" />,
              title: "Salud Articular",
              desc: "Reduce la rigidez matutina y el dolor en las articulaciones, permitiéndote moverte con libertad y comodidad."
            },
            {
              icon: <Heart className="w-10 h-10 text-amber-600" />,
              title: "Salud Cardiovascular",
              desc: "Apoya la función endotelial y ayuda a mantener niveles saludables de colesterol gracias a sus potentes antioxidantes."
            },
            {
              icon: <Brain className="w-10 h-10 text-amber-600" />,
              title: "Función Cognitiva",
              desc: "Protege las neuronas del estrés oxidativo y promueve una mejor memoria y claridad mental a largo plazo."
            },
            {
              icon: <Lightbulb className="w-10 h-10 text-amber-600" />,
              title: "Estado de Ánimo y Claridad Mental",
              desc: "Mejora tu estado de ánimo y reduce el estrés, proporcionando una sensación de calma y enfoque mental durante todo el día."
            },
            {
              icon: <Shield className="w-10 h-10 text-amber-600" />,
              title: "Soporte Inmunológico",
              desc: "Fortalece tus defensas naturales y protege tu cuerpo contra agentes externos, manteniéndote sano y fuerte."
            }
          ].map((benefit, i) => (
            <div key={i} className="bg-stone-50 p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
              <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-serif font-black text-stone-900 mb-4">{benefit.title}</h3>
              <p className="text-stone-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
