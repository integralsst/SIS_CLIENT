// src/features/landing/components/Hero3D.tsx
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence, type Transition } from 'framer-motion';
import { ShieldCheck, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current && Number.isFinite(videoRef.current.duration)) {
        const currentProgress = scrollYProgress.get();
        videoRef.current.currentTime = currentProgress * videoRef.current.duration;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Ocultar el indicador de scroll apenas el usuario baje un poco
    if (latest > 0.02 && !hasScrolled) {
      setHasScrolled(true);
    } else if (latest <= 0.02 && hasScrolled) {
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
        className="sticky top-0 w-full h-screen overflow-hidden m-0 p-0 z-0 flex items-center"
      >
        {/* FADE-IN INICIAL: motion.div para suavizar la carga del video */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#05080a]"
        >
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
        </motion.div>
        
        {/* INDICADOR DE SCROLL INICIAL */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                Explorar el sistema
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ChevronDown size={20} className="text-cyan-500/70" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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