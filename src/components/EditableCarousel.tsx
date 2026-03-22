import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import { Upload, Trash2, ChevronLeft, ChevronRight, Plus, MoveLeft, MoveRight, Save, Loader2 } from 'lucide-react';

interface EditableCarouselProps {
  id: string;
  initialImages: string[];
  className?: string;
  autoPlayInterval?: number;
}

export default function EditableCarousel({ id, initialImages, className = "", autoPlayInterval = 5000 }: EditableCarouselProps) {
  const [slides, setSlides] = useState<{url: string, file?: File}[]>(initialImages.map(url => ({url})));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, isHovered, autoPlayInterval]);

  // Fetch persisted carousel images on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data[id] && Array.isArray(data[id])) {
          setSlides(data[id].map((url: string) => ({url})));
        } else {
          setSlides(initialImages.map(url => ({url})));
        }
      })
      .catch(err => {
        console.warn('Could not fetch persisted carousel:', err);
        setSlides(initialImages.map(url => ({url})));
      });
  }, [id, JSON.stringify(initialImages)]);

  const saveCarouselData = async (newSlides: {url: string, file?: File}[]) => {
    const urlsToSave = newSlides.filter(s => !s.file).map(s => s.url);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [id]: urlsToSave })
      });
    } catch (e) {
      console.error('Failed to save carousel data', e);
    }
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newSlides = Array.from(files).map((file: File) => ({ url: URL.createObjectURL(file), file }));
      setSlides(prev => [...prev, ...newSlides]);
      setCurrentIndex(slides.length); // go to the first new image
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSlides(prev => {
      const newSlides = prev.filter((_, i) => i !== index);
      saveCarouselData(newSlides);
      return newSlides;
    });
    if (currentIndex >= slides.length - 1 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    setSlides(prev => {
      const newSlides = [...prev];
      if (direction === 'left' && index > 0) {
        [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
        setCurrentIndex(index - 1);
      } else if (direction === 'right' && index < newSlides.length - 1) {
        [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
        setCurrentIndex(index + 1);
      }
      saveCarouselData(newSlides);
      return newSlides;
    });
  };

  const handleReplacePhoto = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlides(prev => {
        const newSlides = [...prev];
        newSlides[index] = { url: URL.createObjectURL(file), file };
        return newSlides;
      });
    }
  };

  const handleSavePhoto = async (index: number) => {
    const slide = slides[index];
    if (!slide.file) return;

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('image', slide.file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data.url) {
        setSlides(prev => {
          const newSlides = [...prev];
          newSlides[index] = { url: data.url }; // remove file, update url
          saveCarouselData(newSlides);
          return newSlides;
        });
        alert('¡Imagen guardada permanentemente!');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Hubo un error al guardar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000) {
      nextSlide();
    } else if (swipe > 10000) {
      prevSlide();
    } else if (offset.x < -50) {
      nextSlide();
    } else if (offset.x > 50) {
      prevSlide();
    }
  };

  if (slides.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 ${className}`}>
        <label className="flex flex-col items-center justify-center cursor-pointer p-8 w-full h-full">
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-slate-500 font-medium">Añadir fotos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddPhoto} />
        </label>
      </div>
    );
  }

  return (
    <div 
      className={`relative group/carousel overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Slider */}
      <motion.div 
        className="relative w-full h-full flex"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            
            {/* Edit Controls Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/slide:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
              
              <div className="flex flex-wrap justify-center items-center gap-2 px-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleMovePhoto(idx, 'left'); }}
                  disabled={idx === 0}
                  className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-30 transition-colors"
                  title="Mover a la izquierda"
                >
                  <MoveLeft className="w-5 h-5" />
                </button>
                
                <label className="px-4 py-2 bg-white text-slate-900 rounded-full font-bold text-sm flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={e => e.stopPropagation()}>
                  <Upload className="w-4 h-4" />
                  Cambiar
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplacePhoto(e, idx)} />
                </label>

                {slide.file && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleSavePhoto(idx);
                    }}
                    disabled={uploadingIndex === idx}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-lg disabled:opacity-70"
                    title="Guardar imagen"
                  >
                    {uploadingIndex === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {uploadingIndex === idx ? 'Guardando...' : 'Guardar'}
                  </button>
                )}

                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx); }}
                  className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleMovePhoto(idx, 'right'); }}
                  disabled={idx === slides.length - 1}
                  className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-30 transition-colors"
                  title="Mover a la derecha"
                >
                  <MoveRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
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

      {/* Add Photo Button (Global) */}
      <label className="absolute bottom-4 right-4 p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-xl cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-all z-30 hover:scale-110" title="Añadir más fotos" onClick={e => e.stopPropagation()}>
        <Plus className="w-6 h-6" />
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddPhoto} />
      </label>

      {/* Indicators */}
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
