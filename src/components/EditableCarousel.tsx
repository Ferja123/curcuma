import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Camera, Loader2, Trash2, Plus } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'replace' | 'add'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data[`carousel_${id}`]) {
          setSlides(data[`carousel_${id}`]);
        }
      })
      .catch(err => console.error("Error loading carousel data:", err));
  }, [id]);

  // Auto-play functionality
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, isHovered, autoPlayInterval]);

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

  const handleReplaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUploading) {
      setUploadMode('replace');
      fileInputRef.current?.click();
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUploading) {
      setUploadMode('add');
      fileInputRef.current?.click();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Removed window.confirm as it's blocked in iframe

    setIsUploading(true);
    try {
      const newSlides = slides.filter((_, idx) => idx !== currentIndex);
      
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [`carousel_${id}`]: newSlides })
      });

      setSlides(newSlides);
      setCurrentIndex(prev => prev >= newSlides.length ? Math.max(0, newSlides.length - 1) : prev);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error('Upload failed');
        
        const { url } = await uploadRes.json();
        
        const newSlides = [...slides];
        if (uploadMode === 'replace' && slides.length > 0) {
          newSlides[currentIndex] = { url };
        } else {
          // If adding, or if it's the first image
          if (slides.length === 0) {
            newSlides.push({ url });
          } else {
            newSlides.splice(currentIndex + 1, 0, { url });
          }
        }
        
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [`carousel_${id}`]: newSlides })
        });

        setSlides(newSlides);
        if (uploadMode === 'add' && slides.length > 0) {
          setCurrentIndex(currentIndex + 1);
        } else if (slides.length === 0) {
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  if (slides.length === 0) {
    return (
      <div 
        className={`relative group/carousel overflow-hidden bg-gray-100 flex items-center justify-center min-h-[200px] cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAddClick}
      >
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Plus className="w-12 h-12 mb-2" />
          <span className="text-sm font-medium">Click para agregar la primera imagen</span>
        </div>
        
        <div className={`absolute top-4 right-4 flex flex-col gap-2 z-40 transition-opacity duration-300 ${isHovered || isUploading ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={handleAddClick}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            title="Añadir nueva imagen"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
            <Loader2 className="w-12 h-12 text-white mb-2 animate-spin" />
            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">
              Actualizando...
            </span>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="absolute w-0 h-0 opacity-0"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative group/carousel overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
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
          </div>
        ))}
      </motion.div>

      {/* Edit Controls Overlay */}
      <div className={`absolute top-4 right-4 flex flex-col gap-2 z-40 transition-opacity duration-300 ${isHovered || isUploading ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          title="Añadir nueva imagen"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          onClick={handleReplaceClick}
          className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          title="Cambiar esta imagen"
        >
          <Camera className="w-5 h-5" />
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          title="Eliminar esta imagen"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Uploading Indicator */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <Loader2 className="w-12 h-12 text-white mb-2 animate-spin" />
          <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">
            Actualizando...
          </span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="absolute w-0 h-0 opacity-0"
      />

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
