import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EditableCarouselProps {
  id: string;
  initialImages: string[];
  className?: string;
  autoPlayInterval?: number;
}

export default function EditableCarousel({ id, initialImages, className = "", autoPlayInterval = 5000 }: EditableCarouselProps) {
  const [slides, setSlides] = useState<{url: string}[]>(initialImages.map(url => ({url})));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data && data[`carousel_${id}`]) {
          setSlides(data[`carousel_${id}`]);
        }
      })
      .catch(() => {});
  }, [id]);

  // Auto-play: pauses on hover OR touch
  useEffect(() => {
    if (slides.length <= 1 || isHovered || isTouching) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, isHovered, isTouching, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDragStart = () => {
    setIsTouching(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    // Aumentamos el umbral para que no se deslice con un toque mínimo (evitar que pase rápido accidentalmente)
    const swipePower = Math.abs(offset.x) * (velocity.x || 1);
    
    if (swipePower < -8000 || offset.x < -80) {
      nextSlide();
    } else if (swipePower > 8000 || offset.x > 80) {
      prevSlide();
    }
    
    // Resume auto-play after 8 seconds of no interaction (más tiempo de pausa al interactuar)
    resumeTimerRef.current = setTimeout(() => setIsTouching(false), 8000);
  };

  const handleTouchStart = () => {
    setIsTouching(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchEnd = () => {
    resumeTimerRef.current = setTimeout(() => setIsTouching(false), 8000);
  };

  if (slides.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="flex flex-col items-center justify-center text-gray-400">
          <span className="text-sm font-medium">Imágenes no disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group/carousel overflow-hidden touch-pan-y ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }} // Mejora la interacción en móviles, permitiendo scroll vertical
    >
      <motion.div 
        className="relative w-full h-full flex"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4} // Hace el arrastre con el dedo más libre y fluido
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "tween", ease: "circOut", duration: 0.6 }} // Animación mucho más fluida y natural
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative group/slide">
            <img 
              src={slide.url} 
              alt={`Slide ${idx + 1}`} 
              className="w-full h-full object-cover pointer-events-none" 
              loading={idx === 0 ? "eager" : "lazy"} 
              fetchPriority={idx === 0 ? "high" : "auto"}
              decoding="async" 
              referrerPolicy="no-referrer" 
            />
          </div>
        ))}
      </motion.div>

      {slides.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all z-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all z-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
