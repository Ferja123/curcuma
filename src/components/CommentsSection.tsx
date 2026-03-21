import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Carmen Rosa Silva",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    text: "Yo lo pedí el martes y me llegó el miércoles a mi casa en Surco. Pagué al recibir, todo muy seguro. Ya voy por mi segundo día tomándolo y se siente la diferencia en mis rodillas.",
    time: "Hace 2 horas",
    estrellas: 5,
    plataforma: "TikTok"
  },
  {
    id: 3,
    name: "Ana María Gutiérrez",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    text: "Mi mamá sufría mucho de artritis en las manos, no podía ni tejer. Le compré el tratamiento intensivo y ahora está feliz, ha recuperado mucha movilidad. 100% recomendado.",
    time: "Hace 1 día",
    estrellas: 5,
    plataforma: "Instagram"
  },
  {
    id: 4,
    name: "Roberto Carlos",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    text: "Excelente producto, lo vi en TikTok y dudaba, pero al ver que el pago era contraentrega me animé. Muy buena atención.",
    time: "Hace 2 días",
    estrellas: 5,
    plataforma: "TikTok"
  },
  {
    id: 5,
    name: "Lucía Fernández",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    text: "Me encanta que tenga pimienta negra y aceite MCT, se nota que es una fórmula pensada. El dolor de mi espalda baja ha mejorado un 80%.",
    time: "Hace 3 días",
    estrellas: 5,
    plataforma: "Facebook"
  }
];

export default function CommentsSection() {
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/50 to-slate-900 z-0 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Reseñas de Clientes Reales</h2>
          <p className="text-slate-400 text-lg">Más de 10,000 peruanos ya viven sin dolor articular.</p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x snap-mandatory hide-scrollbar">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="flex-none w-[85vw] sm:w-[400px] snap-center bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/20" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1">
                      {review.name}
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    </h4>
                    <span className="text-xs text-slate-400">{review.time} • Vía {review.plataforma}</span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(review.estrellas)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
