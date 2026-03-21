export default function IngredientsSection() {
  return (
    <section className="py-20 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">El Secreto está en la Sinergia</h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              La cúrcuma por sí sola tiene una baja biodisponibilidad. Por eso hemos creado una fórmula sinérgica que asegura que tu cuerpo absorba cada miligramo.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                  <span className="text-amber-500 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Cúrcuma Orgánica (1500mg)</h3>
                  <p className="text-stone-400">Raíz pura de alta calidad, cultivada sin pesticidas para garantizar la máxima pureza.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                  <span className="text-amber-500 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">95% Curcuminoides</h3>
                  <p className="text-stone-400">El compuesto activo extraído y concentrado para potenciar el efecto antiinflamatorio.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                  <span className="text-amber-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Bioperine® (10mg)</h3>
                  <p className="text-stone-400">Extracto patentado de pimienta negra que aumenta la absorción en un 2000%.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-stone-800 border-4 border-stone-700 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
              <img src="/curcuma-principal.jpg" alt="Ingredientes" className="w-full h-full object-cover rounded-full opacity-80 mix-blend-luminosity" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
