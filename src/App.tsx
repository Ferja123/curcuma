import React, { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, CheckCircle2, Ban, Activity, Flame, Shield, MessageCircle, MapPin, Edit3, Star, X, Sparkles, Heart, Brain, MessageSquareQuote, PlayCircle, Upload, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import FAQ from './components/FAQ';
import CommentsSection from './components/CommentsSection';
import BiologicalAnalysis from './components/BiologicalAnalysis';
import LocationPicker from './components/LocationPicker';
import { motion, AnimatePresence } from "motion/react";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ciudad: 'Lima Metropolitana',
    distrito: '',
    direccion: '',
    referencia: '',
    fechaHora: '',
  });
  const [formErrors, setFormErrors] = useState({
    nombre: '',
    telefono: '',
    distrito: '',
    direccion: '',
    referencia: '',
    fechaHora: '',
  });
  const [touched, setTouched] = useState({
    nombre: false,
    telefono: false,
    distrito: false,
    direccion: false,
    referencia: false,
    fechaHora: false,
  });
  const [paquete, setPaquete] = useState('Tratamiento Intensivo - 2 Frascos + Caja Premium (S/ 149.00)');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [isMobile, setIsMobile] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);
  const [timeLeft, setTimeLeft] = useState(23 * 60); // 23 minutes countdown
  const [stock, setStock] = useState(14); // Initial stock

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const stockTimer = setInterval(() => {
      setStock((prev) => {
        // Decrease stock occasionally, but don't go below 3
        if (prev > 3 && Math.random() > 0.5) {
          return prev - 1;
        }
        return prev;
      });
    }, 12000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(timer);
      clearInterval(stockTimer);
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

  const handleGetLocation = () => {
    setLocationStatus('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('success');
          setLocationFeedback({
            show: true,
            type: 'success',
            message: '¡Coordenadas obtenidas con éxito!'
          });
          setTimeout(() => setLocationFeedback(null), 3500);
        },
        (error) => {
          console.error(error);
          setLocationStatus('error');
          let errorMessage = 'No pudimos obtener tu ubicación. Por favor, asegúrate de darle permisos de ubicación a tu navegador.';
          if (error.code === 1) {
            errorMessage = 'Permiso denegado. Por favor, habilita el acceso a la ubicación en tu navegador para continuar.';
          } else if (error.code === 2) {
            errorMessage = 'La información de ubicación no está disponible en este momento.';
          } else if (error.code === 3) {
            errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación. Inténtalo de nuevo.';
          }
          setLocationFeedback({
            show: true,
            type: 'error',
            message: errorMessage
          });
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationStatus('error');
      setLocationFeedback({
        show: true,
        type: 'error',
        message: 'Tu navegador no soporta geolocalización.'
      });
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
    } else if (name === 'distrito' && formData.ciudad !== 'Provincias') {
      if (!value.trim()) {
        error = 'Selecciona un distrito';
      }
    } else if (name === 'fechaHora') {
      const selectedDate = new Date(value);
      const now = new Date();
      if (selectedDate <= now) {
        error = 'La fecha y hora sugerida debe ser en el futuro';
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
    const isDistritoValid = formData.ciudad === 'Provincias' ? true : validateField('distrito', formData.distrito);
    const isDireccionValid = validateField('direccion', formData.direccion);
    const isReferenciaValid = validateField('referencia', formData.referencia);
    const isFechaHoraValid = validateField('fechaHora', formData.fechaHora);

    setTouched({
      nombre: true,
      telefono: true,
      distrito: true,
      direccion: true,
      referencia: true,
      fechaHora: true,
    });

    if (!isNombreValid || !isTelefonoValid || !isDistritoValid || !isDireccionValid || !isReferenciaValid || !isFechaHoraValid) {
      alert('⚠️ Por favor, corrige los errores en el formulario.');
      return;
    }

    if (!location) {
      alert('📍 Por favor, selecciona tu ubicación en el mapa. Es obligatorio para coordinar la entrega exacta.');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    const phoneNumber = "51919749480";
    const mapsLink = `https://www.google.com/maps?q=${location?.lat},${location?.lng}`;
    const message = `*NUEVO PEDIDO - CÚRCUMA PREMIUM* 🌿\n\n` +
      `*Paquete:* ${paquete}\n` +
      `*Nombre:* ${formData.nombre}\n` +
      `*Teléfono:* ${formData.telefono}\n` +
      `*Ciudad:* ${formData.ciudad}\n` +
      (formData.ciudad !== 'Provincias' ? `*Distrito:* ${formData.distrito}\n` : '') +
      `*Dirección:* ${formData.direccion}\n` +
      `*Referencia:* ${formData.referencia}\n` +
      `*Fecha y Hora sugerida:* ${formData.fechaHora}\n` +
      `*Ubicación GPS:* ${mapsLink}\n\n` +
      `*Pago Contraentrega* 🚚`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
    setIsConfirmModalOpen(false);
  };

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatDateTime = (date: Date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  const minDateTime = formatDateTime(now);
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + 3);
  const maxDateTime = formatDateTime(maxDate);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      
      {/* Creative Floating Stock Badge */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6, type: "spring" }}
        className="fixed bottom-6 md:bottom-8 left-4 z-40 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-red-100 p-3 flex items-center gap-3 max-w-[260px] cursor-pointer hover:scale-105 transition-transform"
        onClick={() => scrollToForm()}
      >
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-20"></div>
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 border border-red-100">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-0.5 animate-pulse">¡Alta Demanda!</p>
          <p className="text-sm font-bold text-slate-800 leading-tight">
            Solo quedan <span className="text-red-600 text-base">{stock}</span> unidades
          </p>
        </div>
      </motion.div>

      {/* 1. HeroSection */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 -z-10 rounded-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
            className="order-2 md:order-1 space-y-6"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-sm mb-2 shadow-sm border border-red-200">
              <Flame className="w-4 h-4" />
              ¡Últimas {stock} unidades en stock!
            </motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Recupera tu Movilidad y <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Dile Adiós al Dolor</span> Hoy Mismo.
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              El secreto natural que está cambiando vidas en TikTok. Cúrcuma de ultra-alta pureza (95%) con pimienta negra para una absorción 2000% mayor.
            </motion.p>
            <motion.button 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
              onClick={() => scrollToForm()}
              className="w-full md:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg md:text-xl font-black py-5 px-8 rounded-2xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
            >
              🛒 CONFIRMAR MI COMPRA
            </motion.button>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="flex items-center gap-2 text-sm text-gray-600 font-bold bg-white/50 inline-block p-2 rounded-lg">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              Más de 1,200 clientes en todo el Perú ya viven sin dolor.
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2 relative bg-gray-100 rounded-3xl aspect-square md:aspect-[4/3] flex items-center justify-center overflow-hidden shadow-xl group"
          >
            {/* Badge Últimas Unidades en la imagen */}
            <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm md:text-base shadow-lg flex items-center gap-2 animate-bounce">
              <Flame className="w-4 h-4 md:w-5 md:h-5" />
              ¡ÚLTIMAS {stock} UNIDADES!
            </div>
            
            <img 
              src="/image_4.jpg" 
              alt="Cúrcuma Premium" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. TrustBadges */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
        className="bg-white border-y border-amber-100 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }} className="flex flex-col items-center gap-3">
              <Leaf className="w-8 h-8 text-amber-600" />
              <span className="font-medium text-gray-700">100% Vegano</span>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }} className="flex flex-col items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
              <span className="font-medium text-gray-700">Calidad Certificada</span>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }} className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-amber-600" />
              <span className="font-medium text-gray-700">Sin Gluten</span>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }} className="flex flex-col items-center gap-3">
              <Ban className="w-8 h-8 text-amber-600" />
              <span className="font-medium text-gray-700">Sin Ingredientes Artificiales</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 3. BenefitsSection */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
          hidden: {}
        }}
        className="py-20 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Recupera tu Movilidad y tu Energía Natural
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="/image_2.jpg" alt="Beneficios de la Cúrcuma" className="w-full h-auto object-cover" referrerPolicy="no-referrer" loading="lazy" />
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-amber-600" />
                  </div>
                  Alivio Articular
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Desinflama rodillas, espalda y articulaciones para que vuelvas a moverte sin dolor.
                </p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5 text-amber-600" />
                  </div>
                  Absorción Superior
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fórmula con Pimienta Negra y Aceite MCT asegura que tu cuerpo absorba cada miligramo.
                </p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  Escudo Inmune
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enriquecido con Propóleo de Abeja y Jengibre para fortalecer tus defensas.
                </p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-amber-600" />
                  </div>
                  Salud Cardiovascular
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ayuda a mantener un corazón sano y mejora la circulación sanguínea.
                </p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="bg-white p-6 rounded-2xl shadow-md border border-amber-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-amber-600" />
                  </div>
                  Función Cognitiva
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Protege tu cerebro del estrés oxidativo y apoya la memoria y la concentración.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. PricingOffer */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
          hidden: {}
        }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="relative bg-white rounded-3xl aspect-square md:aspect-[4/3] flex items-center justify-center overflow-hidden shadow-xl border border-amber-100 group">
              <img 
                src={paquete.includes('2 Frascos') ? '/image_1.jpg' : '/image_3.jpg'} 
                alt="Oferta Especial" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Elige tu Tratamiento</h2>
              
              <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-center gap-2 font-bold text-lg animate-pulse">
                <Timer className="w-6 h-6" />
                Oferta termina en: {formatTime(timeLeft)}
              </div>
              
              {/* Opción 1 */}
              <div className="bg-white border border-amber-200 p-6 rounded-2xl shadow-sm relative mt-4 md:mt-0">
                <span className="absolute -top-4 right-6 bg-slate-900 text-amber-400 px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                  ENVÍO GRATIS
                </span>
                <h3 className="text-xl font-bold text-slate-800">Tratamiento Mensual - 1 Frasco</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">S/ 79.00</p>
                <button 
                  onClick={() => scrollToForm('Tratamiento Mensual - 1 Frasco (S/ 79.00)')}
                  className="mt-6 w-full bg-white border-2 border-[#25D366] hover:bg-green-50 text-[#25D366] py-3 rounded-xl font-bold transition-colors"
                >
                  Confirmar mi compra
                </button>
              </div>

              {/* Opción 2 (Destacada) */}
              <div className="bg-white border-2 border-[#25D366] p-6 rounded-2xl relative shadow-lg transform md:scale-105">
                <span className="absolute -top-4 right-6 bg-amber-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                  ENVÍO GRATIS
                </span>
                <div className="inline-block bg-[#25D366] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                  BEST SELLER
                </div>
                <h3 className="text-xl font-bold text-slate-800">Tratamiento Intensivo - 2 Frascos + Caja Premium</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">S/ 149.00</p>
                <button 
                  onClick={() => scrollToForm('Tratamiento Intensivo - 2 Frascos + Caja Premium (S/ 149.00)')}
                  className="mt-6 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-green-500/30"
                >
                  Confirmar mi compra
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Biological Analysis Section */}
      <BiologicalAnalysis />

      {/* Comments Section */}
      <CommentsSection />

      {/* 5. OrderForm */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
        id="formulario-compra" 
        className="py-24 relative overflow-hidden"
      >
        {/* Premium Decorative Background */}
        <div className="absolute inset-0 bg-slate-900 -z-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615486171448-4afd37c1ef25?q=80&w=2000&auto=format&fit=crop')] opacity-30 bg-cover bg-center -z-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/95 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Completa tus datos para coordinar tu entrega
            </h2>
            <p className="text-amber-400 text-lg md:text-xl font-medium tracking-wide">
              Paga en casa al recibir tu producto. ¡Sin riesgos!
            </p>
          </motion.div>
          
          <motion.form variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-8 relative z-10" onSubmit={handleSubmit}>
            
            {/* Creative Stock Indicator in Form */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 bg-red-500 w-[15%] animate-pulse"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-600 font-bold text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Flame className="w-4 h-4 animate-bounce" /> Alta Demanda
                </span>
                <span className="text-red-600 font-black text-sm bg-red-100 px-3 py-1 rounded-full">Solo quedan {stock} unidades</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full relative overflow-hidden" 
                  style={{ width: `${(stock/50)*100}%`, transition: 'width 1s ease-in-out' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-red-500 font-medium text-right flex items-center justify-end gap-1">
                <Activity className="w-3 h-3" /> 36 personas viendo esto ahora
              </p>
            </motion.div>

            {/* Mostrar el paquete seleccionado */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200 mb-8">
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Selecciona tu paquete:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaquete('Tratamiento Mensual - 1 Frasco (S/ 79.00)')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                    paquete === 'Tratamiento Mensual - 1 Frasco (S/ 79.00)'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'border-amber-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="opacity-90">1 Frasco</span>
                  <span className="text-xl">S/ 79.00</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaquete('Tratamiento Intensivo - 2 Frascos + Caja Premium (S/ 149.00)')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                    paquete === 'Tratamiento Intensivo - 2 Frascos + Caja Premium (S/ 149.00)'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'border-amber-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="opacity-90">2 Frascos + Caja</span>
                  <span className="text-xl">S/ 149.00</span>
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre Completo */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}>
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
              </motion.div>

              {/* Teléfono */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}>
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
              </motion.div>
              
              {/* Ciudad */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                <select
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => {
                    handleInputChange(e);
                    setFormData(prev => ({ ...prev, distrito: '' }));
                  }}
                  onBlur={handleBlur}
                  className="w-full px-5 py-4 rounded-xl border border-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all bg-white text-slate-900"
                >
                  <option value="Lima Metropolitana">Lima Metropolitana</option>
                  <option value="Callao">Callao</option>
                  <option value="Provincias">Provincias</option>
                </select>
              </motion.div>

              {/* Distrito */}
              {formData.ciudad !== 'Provincias' ? (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Distrito</label>
                  <select
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-white text-slate-900 ${
                      touched.distrito && formErrors.distrito 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : touched.distrito && !formErrors.distrito
                        ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                        : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                    required
                  >
                    <option value="">Selecciona tu distrito...</option>
                    {formData.ciudad === 'Lima Metropolitana' ? (
                      <>
                        <option value="Ancón">Ancón</option>
                        <option value="Ate">Ate</option>
                        <option value="Barranco">Barranco</option>
                        <option value="Breña">Breña</option>
                        <option value="Carabayllo">Carabayllo</option>
                        <option value="Chaclacayo">Chaclacayo</option>
                        <option value="Chorrillos">Chorrillos</option>
                        <option value="Cieneguilla">Cieneguilla</option>
                        <option value="Comas">Comas</option>
                        <option value="El Agustino">El Agustino</option>
                        <option value="Independencia">Independencia</option>
                        <option value="Jesús María">Jesús María</option>
                        <option value="La Molina">La Molina</option>
                        <option value="La Victoria">La Victoria</option>
                        <option value="Lince">Lince</option>
                        <option value="Los Olivos">Los Olivos</option>
                        <option value="Lurigancho">Lurigancho</option>
                        <option value="Lurín">Lurín</option>
                        <option value="Magdalena del Mar">Magdalena del Mar</option>
                        <option value="Miraflores">Miraflores</option>
                        <option value="Pachacámac">Pachacámac</option>
                        <option value="Pucusana">Pucusana</option>
                        <option value="Pueblo Libre">Pueblo Libre</option>
                        <option value="Puente Piedra">Puente Piedra</option>
                        <option value="Punta Hermosa">Punta Hermosa</option>
                        <option value="Punta Negra">Punta Negra</option>
                        <option value="Rímac">Rímac</option>
                        <option value="San Bartolo">San Bartolo</option>
                        <option value="San Borja">San Borja</option>
                        <option value="San Isidro">San Isidro</option>
                        <option value="San Juan de Lurigancho">San Juan de Lurigancho</option>
                        <option value="San Juan de Miraflores">San Juan de Miraflores</option>
                        <option value="San Luis">San Luis</option>
                        <option value="San Martín de Porres">San Martín de Porres</option>
                        <option value="San Miguel">San Miguel</option>
                        <option value="Santa Anita">Santa Anita</option>
                        <option value="Santa María del Mar">Santa María del Mar</option>
                        <option value="Santa Rosa">Santa Rosa</option>
                        <option value="Santiago de Surco">Santiago de Surco</option>
                        <option value="Surquillo">Surquillo</option>
                        <option value="Villa El Salvador">Villa El Salvador</option>
                        <option value="Villa María del Triunfo">Villa María del Triunfo</option>
                      </>
                    ) : (
                      <>
                        <option value="Bellavista">Bellavista</option>
                        <option value="Callao">Callao</option>
                        <option value="Carmen de la Legua">Carmen de la Legua</option>
                        <option value="La Perla">La Perla</option>
                        <option value="La Punta">La Punta</option>
                        <option value="Mi Perú">Mi Perú</option>
                        <option value="Ventanilla">Ventanilla</option>
                      </>
                    )}
                  </select>
                  {touched.distrito && formErrors.distrito && (
                    <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.distrito}</p>
                  )}
                </motion.div>
              ) : (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-1 hidden md:block"></motion.div>
              )}

              {/* Dirección */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-1">
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
              </motion.div>
              
              {/* Referencia */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-1">
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
              </motion.div>
              
              {/* Día y hora */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Día y hora que quiere recibir</label>
                <input 
                  type="datetime-local" 
                  name="fechaHora"
                  value={formData.fechaHora}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min={minDateTime}
                  max={maxDateTime}
                  className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all text-slate-900 bg-white ${
                    touched.fechaHora && formErrors.fechaHora 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : touched.fechaHora && !formErrors.fechaHora
                      ? 'border-amber-500 focus:ring-amber-500 bg-amber-50'
                      : 'border-amber-400 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  required
                />
                {touched.fechaHora && formErrors.fechaHora && (
                  <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> {formErrors.fechaHora}</p>
                )}
              </motion.div>

              {/* Ubicación */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }} className="md:col-span-2 pt-4">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Selecciona tu ubicación en el mapa (Obligatorio)</label>
                  
                  <LocationPicker location={location} setLocation={setLocation} />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">O si prefieres, usa tu GPS:</span>
                    <button 
                      type="button" 
                      onClick={handleGetLocation}
                      className={`py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all border text-sm ${
                        locationStatus === 'success' 
                          ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' 
                          : locationStatus === 'error'
                          ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                      }`}
                    >
                      {locationStatus === 'success' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      {locationStatus === 'loading' ? 'Obteniendo...' : 
                       locationStatus === 'success' ? 'GPS Capturado' : 
                       'Usar mi GPS'}
                    </button>
                  </div>

                  {locationStatus === 'error' && locationFeedback?.type === 'error' && (
                    <p className="text-red-500 text-sm font-bold flex items-center gap-1"><Ban className="w-4 h-4"/> {locationFeedback.message}</p>
                  )}
                  {locationStatus === 'success' && locationFeedback?.type === 'success' && (
                    <p className="text-amber-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {locationFeedback.message}</p>
                  )}
                </div>

                {location && (
                  <div className="w-full rounded-2xl overflow-hidden border border-green-200 bg-green-50 p-4 mt-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-800">Ubicación seleccionada</p>
                        <p className="text-xs text-green-600">Lista para envío exacto</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.button 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-5 px-8 rounded-xl shadow-[0_0_40px_rgba(37,211,102,0.4)] hover:shadow-[0_0_60px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center gap-3 text-xl mt-10 uppercase tracking-wide hover:scale-[1.02] animate-pulse"
              style={{ animationDuration: '2s' }}
            >
              <MessageCircle className="w-7 h-7" />
              CONFIRMAR MI COMPRA
            </motion.button>
            <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }} className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5" /> Tus datos están seguros y encriptados
            </motion.p>
          </motion.form>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <FAQ />

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
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ciudad/Distrito</span>
                <span className="font-medium text-gray-900">{formData.ciudad}{formData.ciudad !== 'Provincias' ? ` - ${formData.distrito}` : ''}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Dirección</span>
                <span className="font-medium text-gray-900">{formData.direccion}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Fecha y Hora</span>
                <span className="font-medium text-gray-900">{new Date(formData.fechaHora).toLocaleString('es-PE')}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total a Pagar (Contraentrega):</span>
                <span className="text-xl font-black text-amber-600">
                  {paquete.includes('149') ? 'S/ 149.00' : 'S/ 79.00'}
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

      {/* 9. Location Feedback Modal */}
      {locationFeedback?.show && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
            {locationFeedback.type === 'error' && (
              <button 
                onClick={() => setLocationFeedback(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
            <div className="flex justify-center mb-4">
              {locationFeedback.type === 'success' ? (
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <Ban className="w-8 h-8" />
                </div>
              )}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${locationFeedback.type === 'success' ? 'text-amber-600' : 'text-red-600'}`}>
              {locationFeedback.type === 'success' ? '¡Ubicación Exitosa!' : 'Error de Ubicación'}
            </h3>
            <p className="text-gray-600 mb-6">{locationFeedback.message}</p>
            
            {locationFeedback.type === 'error' && (
              <button
                onClick={() => setLocationFeedback(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors"
              >
                Entendido
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
