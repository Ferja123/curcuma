import React, { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, CheckCircle2, Ban, Activity, Flame, Shield, MessageCircle, MapPin, Edit3, Star, X, Sparkles, Heart, Brain, MessageSquareQuote, PlayCircle, ChevronLeft, ChevronRight, Timer, Truck, ChevronDown, ShoppingBag, User } from 'lucide-react';
import FAQ from './components/FAQ';
import CommentsSection from './components/CommentsSection';
import BiologicalAnalysis from './components/BiologicalAnalysis';
import EditableImage from './components/EditableImage';
import EditableCarousel from './components/EditableCarousel';
import Header from './components/Header';
import { IMAGES } from './config/images';

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: any) => void;
    };
  }
}

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    referencia: '',
    hora: '',
  });
  const [formErrors, setFormErrors] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    referencia: '',
    hora: '',
  });
  const [touched, setTouched] = useState({
    nombre: false,
    telefono: false,
    ciudad: false,
    distrito: false,
    direccion: false,
    referencia: false,
    hora: false,
  });

  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({ name: '', city: '', count: 1, image: '', platform: 'TikTok' });

  const fakePurchasers = [
    { name: 'Mónica', city: 'Arequipa', count: 3, image: '/user_avatar_1.webp', platform: 'TikTok' },
    { name: 'José', city: 'Lima', count: 2, image: '/user_avatar_2.webp', platform: 'Facebook' },
    { name: 'Ricardo', city: 'Trujillo', count: 1, image: '/user_avatar_2.webp', platform: 'Instagram' },
    { name: 'Elena', city: 'Cusco', count: 3, image: '/user_avatar_3.webp', platform: 'TikTok' },
    { name: 'Sofía', city: 'Piura', count: 2, image: '/user_avatar_3.webp', platform: 'Facebook' },
    { name: 'Carlos', city: 'Huancayo', count: 1, image: '/user_avatar_4.webp', platform: 'TikTok' },
    { name: 'Beatriz', city: 'Iquitos', count: 2, image: '/user_avatar_1.webp', platform: 'Instagram' },
    { name: 'Andrés', city: 'Chiclayo', count: 3, image: '/user_avatar_4.webp', platform: 'Facebook' },
    { name: 'Carmen', city: 'Tacna', count: 1, image: '/user_avatar_3.webp', platform: 'TikTok' },
    { name: 'Luis', city: 'Pucallpa', count: 2, image: '/user_avatar_2.webp', platform: 'Instagram' },
    { name: 'Rosa', city: 'Tumbes', count: 3, image: '/user_avatar_5.webp', platform: 'TikTok' },
    { name: 'Miguel', city: 'Callao', count: 2, image: '/user_avatar_6.webp', platform: 'Facebook' },
  ];

  useEffect(() => {
    const triggerNotification = () => {
      const idx = Math.floor(Math.random() * fakePurchasers.length);
      setCurrentNotification(fakePurchasers[idx]);
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    const initialDelay = setTimeout(triggerNotification, 5000);
    const interval = setInterval(triggerNotification, 20000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);
  const [paquete, setPaquete] = useState('2 Frascos (S/ 139.00)');

  const [isMobile, setIsMobile] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(23 * 60); // 23 minutes countdown
  const [stock, setStock] = useState(14); // Initial stock
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // GPS Request with enhanced accuracy
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    
    // Use watchPosition to get an accurate GPS lock. 
    // Phones often return a quick, inaccurate cell-tower location first.
    let watchId: number;
    let bestPos: GeolocationPosition | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const finalize = (pos: GeolocationPosition | null) => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
      if (pos) {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setGeoStatus('granted');
      } else {
        setGeoStatus('denied');
        alert('📍 No logramos obtener tu ubicación exacta. Asegúrate de tener el GPS activado en modo "Alta precisión" (o prueba al aire libre si la señal es débil).');
      }
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        bestPos = position;
        // Si la precisión es menor a 40 metros (muy exacta), cortamos la búsqueda.
        if (position.coords.accuracy <= 40) {
          finalize(position);
        }
      },
      (error) => {
        // Si hay error pero ya teníamos una posición previa, usamos esa
        if (bestPos) {
          finalize(bestPos);
        } else {
          setGeoStatus('denied');
          clearTimeout(timeoutId);
          if (error.code === 1) {
            alert('📍 PERMISO DENEGADO. Por favor, toca el ícono del "candadito" 🔒 junto a la dirección web y habilita "Ubicación" para enviarnos tus coordenadas.');
          } else {
            alert('📍 Error buscando GPS. Por favor, asegúrate de tener la ubicación (GPS) activada en tu celular e inténtalo de nuevo.');
          }
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    // Timeout de 8 segundos: Si no conseguimos precisión perfecta en 8s, 
    // nos conformamos con la mejor que hayamos encontrado hasta ahora.
    timeoutId = setTimeout(() => {
      finalize(bestPos);
    }, 8000);
  };

  // Hide scroll indicator on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setShowScrollIndicator(false);
      
      const formEl = document.getElementById('formulario-compra');
      let formVisible = false;
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        formVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setShowFloatingCTA(window.scrollY > window.innerHeight * 0.4 && !formVisible);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const stockTimer = setInterval(() => {
      setStock((prev) => {
        if (prev > 3 && Math.random() > 0.5) return prev - 1;
        return prev;
      });
    }, 12000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(timer);
      clearInterval(stockTimer);
    };
  }, []);

  // Auto-play video when scrolled into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlaying = () => {
      video.play().catch(error => {
        console.log("Autoplay prevented, waiting for interaction:", error);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlaying();
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 } // Lower threshold for better response
    );

    // Interaction fallback to "unlock" muted autoplay if browser blocked it initially
    const unlock = () => {
      if (videoRef.current && observer) {
        // If the observer says we are visible, try playing again on any click
        const rect = videoRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          videoRef.current.play().catch(() => {});
        }
      }
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);

    observer.observe(video);
    return () => {
      observer.disconnect();
      window.removeEventListener('click', unlock);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToForm = (paqueteSeleccionado?: string) => {
    if (paqueteSeleccionado) {
      setPaquete(paqueteSeleccionado);
    }
    const form = document.getElementById('formulario-compra');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'Este campo es obligatorio';
    } else if (name === 'telefono') {
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(value)) {
        error = 'Ingresa un número válido de 9 dígitos (ej. 999888777)';
      }
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNombreValid = validateField('nombre', formData.nombre);
    const isTelefonoValid = validateField('telefono', formData.telefono);
    const isCiudadValid = validateField('ciudad', formData.ciudad);
    const isDistritoValid = validateField('distrito', formData.distrito);
    const isDireccionValid = validateField('direccion', formData.direccion);
    const isReferenciaValid = validateField('referencia', formData.referencia);
    const isHoraValid = validateField('hora', formData.hora);

    setTouched({
      nombre: true,
      telefono: true,
      ciudad: true,
      distrito: true,
      direccion: true,
      referencia: true,
      hora: true,
    });

    if (!isNombreValid || !isTelefonoValid || !isCiudadValid || !isDistritoValid || !isDireccionValid || !isReferenciaValid || !isHoraValid) {
      // Form has errors, they will be displayed inline
      return;
    }

    // No GPS requirement - just open confirmation
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    const phoneNumber = "51919749480";
    const message = `*NUEVO PEDIDO - CÚRCUMA PREMIUM* 🌿\n\n` +
      `*Paquete:* ${paquete}\n` +
      `*Nombre:* ${formData.nombre}\n` +
      `*Teléfono:* ${formData.telefono}\n` +
      `*Ciudad:* ${formData.ciudad}\n` +
      `*Distrito:* ${formData.distrito}\n` +
      `*Dirección:* ${formData.direccion}\n` +
      `*Referencia:* ${formData.referencia}\n` +
      `*Hora sugerida:* ${formData.hora}` +
      `\n\n*Pago Contraentrega* 🚚\n_Un asesor te contactará para confirmar tu ubicación exacta._`;

    // Track conversion with TikTok Pixel
    if (window.ttq) {
      window.ttq.track('PlaceAnOrder', {
        content_name: paquete,
        currency: 'PEN',
        value: paquete.includes('79') ? 79 : paquete.includes('139') ? 139 : 189
      });
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Top Banner */}
      {/* Dynamic Sticky Countdown Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 shadow-xl sticky top-0 z-[60] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-amber-100">Envío Gratis a todo el Perú</span>
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
        </div>
        <div className="h-4 w-[1px] bg-slate-700 hidden md:block"></div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[10px] md:text-sm font-bold text-slate-300 uppercase tracking-wider">La oferta expira en:</span>
          </div>
          <div className="bg-slate-800 px-3 py-1 rounded-lg border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="text-amber-500 font-black tabular-nums text-sm md:text-lg min-w-[65px] inline-block">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Header removed - only top bar remains */}
      


      {/* 1. HeroSection */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 -z-10 rounded-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div
            className="order-2 md:order-1 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-sm mb-2 shadow-sm border border-red-200">
              <Flame className="w-4 h-4" />
              ¡Últimas {stock} unidades en stock!
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Recupera tu Movilidad y <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Dile Adiós al Dolor</span> Hoy Mismo.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              El secreto natural que está cambiando vidas en TikTok. Cúrcuma de ultra-alta pureza (95%) con pimienta negra para una absorción 2000% mayor.
            </p>
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-bold bg-white/50 inline-block p-2 rounded-lg mr-auto">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                Más de 1,200 clientes en todo el Perú ya viven sin dolor.
              </div>
              
              <button 
                onClick={() => scrollToForm()}
                className="group relative w-full md:w-auto px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-xl md:text-2xl rounded-2xl shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />
                <span className="uppercase tracking-tighter">¡Pedir ahora y pagar en casa!</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2.5 animate-pulse bg-green-50/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-200/50 inline-flex">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-sm font-bold text-gray-700">
                  <span className="text-green-700">25 personas</span> están comprando en este momento
                </span>
              </div>
            </div>
          </div>
          <div
            className="order-1 md:order-2 relative bg-gray-100 rounded-3xl aspect-square md:aspect-[4/3] flex items-center justify-center overflow-hidden shadow-xl group"
          >
            {/* Badge Últimas Unidades en la imagen */}
            <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm md:text-base shadow-lg flex items-center gap-2">
              <Flame className="w-4 h-4 md:w-5 md:h-5" />
              ¡ÚLTIMAS {stock} UNIDADES!
            </div>
            
            {/* Sello Producto Original */}
            <div className="absolute bottom-4 right-4 z-20 bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-900 text-[10px] md:text-sm font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_4px_15px_rgba(245,158,11,0.5)] flex items-center gap-1.5 border border-amber-200 backdrop-blur-sm animate-float">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> 100% Original
            </div>
            
            <EditableCarousel 
              id="heroCarousel"
              initialImages={IMAGES.heroCarousel} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              autoPlayInterval={4000}
            />
          </div>
        </div>

        {/* Professional Scroll Indicator */}
        {showScrollIndicator && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group z-30 animate-fade-in hidden md:flex"
            onClick={() => {
              const beneficiosect = document.getElementById('beneficios');
              if (beneficiosect) beneficiosect.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-amber-800/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-2 group-hover:text-amber-600 transition-colors bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Desliza
            </span>
            <div className="relative w-6 h-10 border-2 border-amber-500/30 rounded-full flex justify-center p-1 group-hover:border-amber-500/60 transition-colors bg-white/50 backdrop-blur-sm">
              <div className="w-1 h-2.5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full animate-[scrollDot_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
            </div>
            <div className="mt-1 flex flex-col items-center">
              <ChevronDown className="w-4 h-4 text-amber-600/40 animate-[bounceSlow_2.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </section>

      {/* High Impact Section: Ingredients Burst */}
      <section className="py-12 bg-white flex flex-col items-center">
        <div className="max-w-4xl w-full px-4 text-center">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-2 border-amber-500/10 group">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10"></div>
             <img 
               src="/impact_ingredients_burst.webp" 
               alt="Pura Cúrcuma e Ingredientes Naturales" 
               className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105" 
             />
             <div className="absolute bottom-10 left-0 right-0 z-20 px-8 text-center">
               <h2 className="text-white text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">El Poder de la Sinergia Natural</h2>
               <p className="text-amber-100 font-bold text-lg md:text-xl drop-shadow-md italic uppercase tracking-wider">Absorción 2000% Optimizada</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Quality & Trust Section (Garantía de Calidad) - High Impact Banner [REDEPLOY_FORCE] */}
      <section
        className="py-16 bg-white flex flex-col items-center border-y border-amber-100"
      >
        <div className="max-w-4xl w-full px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 uppercase tracking-widest">Garantía de Calidad Farmacéutica</h2>
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
             <img 
               src={IMAGES.trustBadges} 
               alt="Garantía de Calidad Premium" 
               className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105" 
               loading="lazy"
               decoding="async"
             />
             <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-20 px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                 <h3 className="text-white text-xl md:text-3xl font-black mb-1 drop-shadow-lg">Pureza Certificada al 95%</h3>
                 <p className="text-amber-300 font-bold text-sm md:text-lg drop-shadow-md uppercase tracking-wider">Estándar de Grado Clínico</p>
               </div>
               <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 shadow-xl border border-amber-400/50">
                 <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                 <span className="text-amber-900 font-black text-xs md:text-sm uppercase whitespace-nowrap">Producto 100% Original</span>
               </div>
             </div>
          </div>
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-lg border border-amber-100/50 max-w-2xl mx-auto">
            <p className="text-center text-xs md:text-sm font-bold text-amber-800 uppercase tracking-[0.2em] mb-6">Certificaciones de Calidad Internacional</p>
            <img 
              src="/trust_badges_grid.webp" 
              alt="Certificaciones: 100% Natural, GMP Certified, Pure Curcumin 95%, Clinical Grade, Laboratory Tested, FDA Facility" 
              className="w-full max-w-lg mx-auto object-contain drop-shadow-md"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            {/* Badge 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 hover:bg-amber-50 transition-colors border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600 shadow-inner">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Envío Gratis</h3>
              <p className="text-slate-600 leading-relaxed">A todo el país, sin costos ocultos. Recibe tu pedido directamente en la puerta de tu casa de forma rápida y segura.</p>
            </div>
            
            {/* Badge 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 hover:bg-amber-50 transition-colors border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600 shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pago Seguro</h3>
              <p className="text-slate-600 leading-relaxed">Paga en efectivo o transferencia únicamente cuando tengas el producto en tus manos. ¡Cero riesgos para ti!</p>
            </div>
            
            {/* Badge 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 hover:bg-amber-50 transition-colors border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600 shadow-inner">
                <Leaf className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Natural</h3>
              <p className="text-slate-600 leading-relaxed">Fórmula orgánica sin químicos añadidos, estandarizada al 95% de pureza para garantizar la máxima absorción.</p>
            </div>
          </div>
      </section>

      {/* 4. Benefits & Video Section */}
      <section
        id="beneficios"
        className="py-20 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Recupera tu Movilidad y tu Energía Natural
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <video 
                ref={videoRef}
                src="/video-promocional-curcuma.mp4" 
                className="w-full h-auto object-cover" 
                autoPlay
                loop 
                muted 
                playsInline
                preload="auto"
                poster="/hero-image-1.webp"
                loading="lazy"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-amber-600" />
                  </div>
                  Alivio Articular
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Desinflama rodillas, espalda y articulaciones para que vuelvas a moverte sin dolor.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5 text-amber-600" />
                  </div>
                  Absorción Superior
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fórmula con Pimienta Negra y Aceite MCT asegura que tu cuerpo absorba cada miligramo.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  Escudo Inmune
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enriquecido con Propóleo de Abeja y Jengibre para fortalecer tus defensas.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-amber-600" />
                  </div>
                  Salud Cardiovascular
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ayuda a mantener un corazón sano y mejora la circulación sanguínea.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-amber-600" />
                  </div>
                  Función Cognitiva
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Protege tu cerebro del estrés oxidativo y apoya la memoria y la concentración.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biological Analysis Section */}
      <BiologicalAnalysis />

      {/* Comments Section */}
      <CommentsSection />

      {/* 5. OrderForm */}
      <section
        id="formulario-compra" 
        className="py-24 relative overflow-hidden"
      >
        {/* Premium Decorative Background */}
        <div className="absolute inset-0 bg-slate-900 -z-20"></div>
        <div className="absolute inset-0 opacity-30 bg-cover bg-center -z-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/95 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-5xl font-black text-amber-400 mb-6 tracking-tight drop-shadow-md">
              Completa tus datos para coordinar tu entrega
            </h2>
            <p className="text-amber-100 text-lg md:text-xl font-medium tracking-wide mb-6">
              Paga en casa al recibir tu producto. ¡Sin riesgos!
            </p>
            <div className="flex justify-center mb-8 relative">
              <img 
                src={paquete.includes('3 Frascos') ? IMAGES.paqueteTresFrascos : paquete.includes('2 Frascos') ? IMAGES.paqueteDosFrascos : IMAGES.paqueteUnFrasco} 
                alt="Paquete Seleccionado - Cúrcuma" 
                className="h-64 md:h-80 w-auto max-w-full object-contain rounded-2xl drop-shadow-2xl hover:scale-105 transition-all duration-500"
                loading="lazy"
                decoding="async"
              />
               {/* Sello Original */}
              <div className="absolute top-0 right-1/2 transform translate-x-16 md:translate-x-32 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10 border border-yellow-200">
                <ShieldCheck className="w-4 h-4" /> 100% Original
              </div>
            </div>

          </div>
          
          <form className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-8 relative z-10" onSubmit={handleSubmit}>
            
            {/* Creative Stock Indicator in Form */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-900 font-black text-xs md:text-sm flex items-center gap-2 uppercase tracking-widest">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  Estado del Inventario
                </span>
                <span className="text-red-600 font-black text-xs md:text-sm bg-white px-4 py-1.5 rounded-full shadow-md border border-red-100 ring-4 ring-red-50 mb-1">
                  SOLO {stock} UNIDADES
                </span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/30">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(239,68,68,0.3)] relative" 
                  style={{ width: `${(stock/30)*100}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_2s_linear_infinite]"></div>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-amber-800 mt-3 font-medium italic text-right flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                Actualizado hace unos segundos - Alta demanda detectada
              </p>
            </div>

            {/* Mostrar el paquete seleccionado */}
            <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200 mb-8">
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Selecciona tu paquete:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaquete('1 Frasco (S/ 99.00)')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                    paquete === '1 Frasco (S/ 99.00)'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'border-amber-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="opacity-90">1 Frasco</span>
                  <span className="text-xl">S/ 99.00</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaquete('2 Frascos (S/ 139.00)')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                    paquete === '2 Frascos (S/ 139.00)'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'border-amber-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="opacity-90">2 Frascos</span>
                  <span className="text-xl">S/ 139.00</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaquete('3 Frascos (S/ 189.00)')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                    paquete === '3 Frascos (S/ 189.00)'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'border-amber-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="opacity-90">3 Frascos</span>
                  <span className="text-xl">S/ 189.00</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombres Completos</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-white text-slate-900 placeholder-slate-500 ${
                    touched.nombre && formErrors.nombre 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.nombre && !formErrors.nombre
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Ej. Juan Pérez" 
                  required
                />
                {touched.nombre && formErrors.nombre && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.nombre}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono (WhatsApp)</label>
                <input 
                  type="tel" 
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-white text-slate-900 placeholder-slate-500 ${
                    touched.telefono && formErrors.telefono 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.telefono && !formErrors.telefono
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Ej. 999888777" 
                  required
                />
                {touched.telefono && formErrors.telefono && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.telefono}</p>
                )}
              </div>
              
              {/* Ciudad */}
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                <input 
                  type="text" 
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ej. Lima, Arequipa..."
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all text-slate-900 bg-white ${
                    touched.ciudad && formErrors.ciudad 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.ciudad && !formErrors.ciudad
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  required
                />
                {touched.ciudad && formErrors.ciudad && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.ciudad}</p>
                )}
              </div>

              {/* Distrito */}
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Distrito</label>
                <input 
                  type="text" 
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ej. Miraflores, Yanahuara..."
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all text-slate-900 bg-white ${
                    touched.distrito && formErrors.distrito 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.distrito && !formErrors.distrito
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  required
                />
                {touched.distrito && formErrors.distrito && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.distrito}</p>
                )}
              </div>

              {/* Dirección */}
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Dirección de entrega</label>
                <input 
                  type="text" 
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-white text-slate-900 placeholder-slate-500 ${
                    touched.direccion && formErrors.direccion 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.direccion && !formErrors.direccion
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Ej. Av. Los Pinos 123" 
                  required
                />
                {touched.direccion && formErrors.direccion && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.direccion}</p>
                )}
              </div>
              
              {/* Referencia */}
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Referencias de la dirección</label>
                <input 
                  type="text" 
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-white text-slate-900 placeholder-slate-500 ${
                    touched.referencia && formErrors.referencia 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.referencia && !formErrors.referencia
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Ej. Frente al parque, casa verde" 
                  required
                />
                {touched.referencia && formErrors.referencia && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.referencia}</p>
                )}
              </div>
              
              {/* Hora */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">¿En qué horario prefieres recibirlo?</label>
                <div className="relative">
                  <select 
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-4 rounded-xl border appearance-none focus:ring-2 focus:outline-none transition-all text-slate-900 bg-white ${
                      touched.hora && formErrors.hora 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : touched.hora && !formErrors.hora
                        ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                        : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                    required
                  >
                    <option value="" disabled>Selecciona un horario...</option>
                    <option value="Cualquier hora (8am - 8pm)">Cualquier hora (8am - 8pm)</option>
                    <option value="Mañana (8am - 12pm)">Mañana (8am - 12pm)</option>
                    <option value="Tarde (12pm - 4pm)">Tarde (12pm - 4pm)</option>
                    <option value="Noche (4pm - 8pm)">Noche (4pm - 8pm)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {touched.hora && formErrors.hora && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.hora}</p>
                )}
              </div>
              
              {/* Advisor Note - replaces GPS */}
              <div className="md:col-span-2 pt-4">
                <div className="w-full rounded-2xl p-5 bg-blue-50 border border-blue-200 text-blue-800 flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black mb-1">📦 Entrega Rápida y Precisa</h4>
                    <p className="text-xs leading-relaxed text-blue-700">Después de confirmar tu compra, <strong>un asesor se comunicará contigo</strong> para pedirte tu ubicación exacta y así facilitar la entrega rápida y precisa del motorizado.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-5 px-8 rounded-2xl shadow-[0_0_40px_rgba(37,211,102,0.4)] hover:shadow-[0_0_60px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center gap-3 text-xl mt-10 uppercase tracking-wide hover:scale-[1.02]"
            >
              <MessageCircle className="w-7 h-7" />
              CONFIRMAR MI COMPRA
            </button>
            <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5" /> Tus datos están seguros y encriptados
            </p>
          </form>
        </div>
      </section>

      {/* FAQ Section with Zero Gap */}
      <div className="bg-white -mt-px relative z-20">
        <FAQ />
      </div>

      {/* 8. Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsConfirmModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirmar Pedido</h3>
            <p className="text-gray-600 mb-6">Por favor, revisa los detalles de tu pedido antes de enviarlo por WhatsApp.</p>
            
            <div className="bg-gray-50 p-5 rounded-2xl mb-8 text-sm text-gray-700 space-y-3 border border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Paquete Seleccionado</span>
                <span className="font-medium text-gray-900">{paquete}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Nombre</span>
                <span className="font-medium text-gray-900">{formData.nombre}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ciudad / Distrito</span>
                <span className="font-medium text-gray-900">{formData.ciudad} - {formData.distrito}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Dirección</span>
                <span className="font-medium text-gray-900">{formData.direccion}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Hora</span>
                <span className="font-medium text-gray-900">{formData.hora}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total a Pagar (Contraentrega):</span>
                <span className="text-xl font-black text-amber-600">
                  {paquete.includes('189') ? 'S/ 189.00' : paquete.includes('139') ? 'S/ 139.00' : 'S/ 99.00'}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl transition-colors"
              >
                Editar
              </button>
              <button
                onClick={confirmOrder}
                className="flex-[2] bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/40 hover:scale-[1.02] animate-pulse"
                style={{ animationDuration: '2s' }}
              >
                <MessageCircle className="w-6 h-6" />
                CONFIRMAR MI COMPRA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Floating CTA - Centered Bottom */}
      <div className={`fixed bottom-4 left-0 right-0 z-50 px-4 pointer-events-none flex flex-col items-center transition-all duration-500 md:hidden ${showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <div className="pointer-events-auto w-full max-w-[280px] flex flex-col items-center gap-1.5 shadow-2xl">
          {/* Stock Notification */}
          <div className="bg-red-600 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-2 border border-red-400/30 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-white" /> 
            <span>¡ULTIMAS <span className="text-yellow-300 font-black">{stock}</span> UNIDADES EN STOCK!</span>
          </div>
          {/* Main CTA Button */}
          <button 
            onClick={() => {
              const form = document.getElementById('formulario-compra');
              if (form) form.scrollIntoView({behavior:'smooth'});
            }} 
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-black py-4 rounded-3xl shadow-[0_10px_30px_rgba(34,197,94,0.4)] transition-all flex justify-center items-center gap-3 text-lg uppercase tracking-wider active:scale-95 border-2 border-white/20"
          >
            <ShoppingBag className="w-6 h-6" />
            COMPRAR AHORA
          </button>
        </div>
      </div>

      {/* 10. Fake Live Purchase Notification */}
      <div className={`fixed top-4 left-4 right-4 md:right-auto md:bottom-24 md:top-auto md:left-4 z-[90] transition-all duration-700 transform ${showNotification ? 'translate-y-0 md:translate-x-0 opacity-100' : '-translate-y-full md:-translate-x-full opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-2xl border border-amber-100 flex items-center gap-3 md:gap-4 max-w-full md:max-w-[320px] mx-auto md:mx-0">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-amber-500/20 shrink-0 shadow-sm">
            <img 
              src={currentNotification.image} 
              alt={currentNotification.name} 
              className="w-full h-full object-cover" 
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-wider">¡Nuevo pedido!</p>
              <span className={`text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-full ${
                currentNotification.platform === 'TikTok' ? 'bg-black text-white' : 
                currentNotification.platform === 'Facebook' ? 'bg-blue-600 text-white' : 
                'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white'
              }`}>
                {currentNotification.platform}
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-900 truncate">
              {currentNotification.name} de {currentNotification.city}
            </p>
            <p className="text-[10px] md:text-xs text-slate-500">
              Pidió <span className="font-bold text-amber-500">{currentNotification.count} {currentNotification.count === 1 ? 'frasco' : 'frascos'}</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
