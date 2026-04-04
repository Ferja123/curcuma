import React from 'react';
import { Beaker, Zap, ShieldCheck, Leaf, Activity, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../config/images';
import EditableImage from './EditableImage';

const BiologicalAnalysis = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      title: "1. Curcumina al 95% (El Motor Antiinflamatorio)",
      description: "La cúrcuma normal de cocina solo tiene entre un 2% y un 5% de curcumina. Nuestro suplemento está estandarizado al 95%. Es un extracto purificado con un poder antioxidante y antiinflamatorio brutal, con estudios clínicos que respaldan su eficacia para aliviar el dolor articular, la rigidez y reducir la inflamación sistémica."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "2. Extracto de Pimienta Negra (El Hack de Absorción)",
      description: "La curcumina por sí sola tiene una biodisponibilidad bajísima. La piperina de la pimienta negra inhibe temporalmente las enzimas digestivas del hígado, aumentando la absorción de la curcumina hasta en un 2,000%. Sin este ingrediente, la cúrcuma es casi inútil."
    },
    {
      icon: <Beaker className="w-6 h-6 text-amber-500" />,
      title: "3. Aceite MCT (El Vehículo Conductor)",
      description: "La curcumina es liposoluble, solo se disuelve y absorbe en presencia de grasa. Al incluir Aceite MCT (triglicéridos de cadena media), garantizamos que el cuerpo absorba el suplemento directamente en el tracto digestivo de manera rápida y eficiente."
    },
    {
      icon: <Leaf className="w-6 h-6 text-amber-500" />,
      title: "4. Jengibre (El Sinergista)",
      description: "El jengibre y la cúrcuma son 'primos' botánicos. Tienen un efecto sinérgico comprobado. Mientras la cúrcuma ataca la inflamación sistémica, el jengibre alivia las molestias gastrointestinales y potencia el alivio del dolor muscular."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "5. Propóleo y Vitamina C (El Escudo Inmune)",
      description: "La Vitamina C es fundamental para la síntesis de colágeno (vital para regenerar el cartílago) y, al ser liposoluble, no se elimina rápido. El Propóleo es uno de los antimicrobianos naturales más potentes. Juntos, no solo combaten el dolor, sino que blindan tu sistema inmunológico."
    }
  ];

  return (
    <section id="analisis" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-900 to-slate-900 -z-10"></div>
      <div className="absolute top-0 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 font-bold text-sm mb-6 border border-amber-500/20"
          >
            <Beaker className="w-4 h-4" />
            Análisis Biológico de tu Fórmula
          </div>
          <h2 
            data-aos="fade-up" data-aos-delay="100"
            className="text-3xl md:text-5xl font-black mb-6 tracking-tight"
          >
            ¿Por qué funciona tan rápido?
          </h2>
          <p 
            data-aos="fade-up" data-aos-delay="200"
            className="text-lg text-slate-300"
          >
            Esta no es una simple "pastilla de cúrcuma". Es una Fórmula Magistral de Alta Biodisponibilidad diseñada para que tu cuerpo no desperdicie ni un miligramo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Features List */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                data-aos="fade-right"
                data-aos-delay={index * 100}
                className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Veredicto Comercial / Highlight */}
          <div className="space-y-8">
            <div
              data-aos="zoom-in"
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50"
            >
              <EditableImage id="analisisBiologicoImage" initialSrc={IMAGES.analisisBiologico} alt="Información Nutricional" className="w-full h-auto object-cover" referrerPolicy="no-referrer" loading="lazy" />
            </div>

            {/* Impact Image: Joint Health Visualization */}
            <div
              data-aos="fade-up"
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60"></div>
              <img 
                src="/impact_joint_health.png" 
                alt="Visualización de Salud Articular" 
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                decoding="async"
              />
              <div className="absolute bottom-4 left-6 z-20">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Tecnología de Absorción</span>
                <p className="text-white font-bold text-sm">Efecto Antiinflamatorio Profundo</p>
              </div>
            </div>
            
            <div 
              data-aos="zoom-in" data-aos-delay="200"
              className="relative"
            >
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-3xl shadow-2xl shadow-amber-500/20">
                <div className="bg-slate-900 p-8 md:p-12 rounded-[1.4rem] h-full">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/30">
                    <ShieldCheck className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight">
                    El Veredicto Científico
                  </h3>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Mientras otros venden "Cúrcuma" que tu cuerpo desecha, tú estás a punto de probar <strong className="text-amber-400">la única Curcumina que tu cuerpo absorbe al 100%</strong>. 
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-slate-200 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      Absorción 2000% mayor comprobada
                    </li>
                    <li className="flex items-center gap-3 text-slate-200 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      Alivio del dolor articular más rápido
                    </li>
                    <li className="flex items-center gap-3 text-slate-200 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      Protección gástrica e inmunológica
                    </li>
                  </ul>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                    <p className="text-amber-400 font-bold">Tratamiento Definitivo de Alta Gama</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiologicalAnalysis;
