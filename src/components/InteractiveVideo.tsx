import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Info, Upload } from 'lucide-react';

export default function InteractiveVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("https://cdn.pixabay.com/video/2020/05/26/40242-425268412_large.mp4");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Show interactive overlay between 3 and 10 seconds
      if (videoRef.current.currentTime > 3 && videoRef.current.currentTime < 10) {
        setShowOverlay(true);
      } else {
        setShowOverlay(false);
      }
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615486171448-4afd37c1ef25?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-luminosity"></div>
      
      {/* Decorative glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] translate-y-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          data-aos="fade-up"
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-amber-400">
            Descubre el Poder de la Cúrcuma
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Mira cómo nuestra fórmula premium de extracción en frío preserva todos los curcuminoides activos para tu salud.
          </p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            Subir mi propio video
          </button>
          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleVideoUpload}
          />
        </div>

        <div 
          data-aos="zoom-in" data-aos-delay="200"
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-black aspect-video max-w-4xl mx-auto ring-4 ring-amber-500/10"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1615486171448-4afd37c1ef25?q=80&w=1200&auto=format&fit=crop"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            loop
            muted={isMuted}
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>

          {/* Interactive Overlay */}
          <div className={`absolute top-8 left-8 max-w-xs bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-amber-400/50 shadow-2xl transition-all duration-500 transform ${showOverlay ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0 pointer-events-none'}`}>
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 p-2 rounded-full text-slate-900 mt-1 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-400 text-lg mb-1">95% Curcuminoides</h4>
                <p className="text-sm text-slate-200">Nuestra fórmula contiene la máxima concentración del mercado, garantizando resultados rápidos.</p>
              </div>
            </div>
          </div>

          {/* Custom Controls Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <button 
                onClick={togglePlay}
                className="w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    }
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Big Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none">
              <div className="w-24 h-24 bg-amber-500/90 text-slate-900 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                <Play className="w-10 h-10 ml-2" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
