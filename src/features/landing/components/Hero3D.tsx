// src/features/landing/components/Hero3D.tsx
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence, type Transition } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
// Importación del logo basada en tu estructura de carpetas
import logoSis from '../../../assets/logosis.png';

export const Hero3D = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const frameRef = useRef<number | null>(null);
  const [showText, setShowText] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Limpieza de animaciones pendientes
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // FIX: Manejo de visibilidad y repintado de video al volver a la pestaña
  useEffect(() => {
    const handleFocusOrVisibility = () => {
      if (
        (document.visibilityState === 'visible' || document.hasFocus()) && 
        videoRef.current && 
        Number.isFinite(videoRef.current.duration)
      ) {
        // Envolvemos en requestAnimationFrame para asegurar que el motor de renderizado esté listo
        requestAnimationFrame(() => {
          if (videoRef.current) {
            const currentProgress = scrollYProgress.get();
            // El + 0.0001 es el truco clave: fuerza al navegador a repintar el frame congelado
            videoRef.current.currentTime = (currentProgress * videoRef.current.duration) + 0.0001;
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleFocusOrVisibility);
    window.addEventListener("focus", handleFocusOrVisibility);
    
    return () => {
      document.removeEventListener("visibilitychange", handleFocusOrVisibility);
      window.removeEventListener("focus", handleFocusOrVisibility);
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Umbral muy bajo (1%) para que desaparezca al más mínimo intento de bajar
    if (latest > 0.01 && !hasScrolled) {
      setHasScrolled(true);
    } else if (latest <= 0.01 && hasScrolled) {
      setHasScrolled(false);
    }

    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      const currentTime = latest * videoRef.current.duration;

      if (currentTime < 6.0 && showText) {
        setShowText(false);
      } else if (currentTime >= 6.0 && !showText) {
        setShowText(true);
      }

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
        }
      });
    }
  });

  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0.9, 1], [0, -50]);

  const customTransition: Transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#05080a] m-0 p-0 flex flex-col">
      <motion.div 
        style={{ opacity, y, willChange: "opacity, transform" }}
        className="sticky top-0 w-full h-screen overflow-hidden m-0 p-0 z-0 flex items-center justify-center"
      >
        {/* Contenedor del Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#05080a]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover" 
            src="/videos/hero-3d.mp4"
            muted
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_70%,_#05080a_100%)] opacity-70" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_100%_100%,_#05080a_0%,_#05080a_25%,_transparent_60%)]" />
        </div>

        {/* SPLASH SCREEN: Overlay con Logo e Indicador de Scroll */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)", scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#05080a]/40"
            >
              {/* Logo Central con Animación Cinemática */}
              <motion.img 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                src={logoSis} 
                alt="SIS Sistema de Gestión" 
                className="w-64 md:w-80 lg:w-80 object-contain drop-shadow-2xl"
              />

              {/* Indicador de Acción (Scroll Cue) Upgrade Premium */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                className="absolute bottom-10 flex flex-col items-center gap-4 pointer-events-none"
              >
                {/* Texto más sutil y elegante */}
                <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-slate-400 font-medium drop-shadow-sm">
                  Desliza para comenzar
                </span>
                
                {/* Animación de línea de luz cayendo (Estilo minimalista) */}
                <div className="w-[1px] h-12 md:h-16 bg-slate-800/60 relative overflow-hidden rounded-full">
                  <motion.div
                    className="w-full h-1/3 bg-cyan-400 shadow-[0_0_8px_1px_rgba(34,211,238,0.8)]"
                    animate={{ y: ["-150%", "300%"] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.8, 
                      ease: [0.65, 0, 0.35, 1]
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Textos Laterales */}
        <div className="absolute right-6 md:right-24 lg:right-32 xl:right-40 top-1/2 -translate-y-1/2 z-10 w-full max-w-lg md:max-w-xl pointer-events-none">
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key="main-text"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={customTransition}
                style={{ willChange: "opacity, transform" }}
                className="flex flex-col items-end text-right"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-[#0c131a] text-slate-300 text-[11px] uppercase tracking-[0.25em] font-semibold mb-6 shadow-sm">
                  <ShieldCheck size={14} className="text-cyan-400" /> 
                  Decreto 1072 & Res 0312
                </div>

                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tighter leading-[1.05] md:leading-[1.1]">
                  Cumplimiento Legal. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-400 to-blue-500">
                    Sin Complicaciones.
                  </span>
                </h2>

                <p className="text-[17px] sm:text-lg md:text-xl lg:text-2xl text-slate-400/90 font-medium leading-relaxed tracking-tight max-w-md">
                  Automatiza las inspecciones y gestiona riesgos en tiempo real.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};