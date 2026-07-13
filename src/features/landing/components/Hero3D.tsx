// src/features/landing/components/Hero3D.tsx
import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  AnimatePresence,
  type Transition,
} from "framer-motion";
import { ShieldCheck } from "lucide-react";
import logoSis from "../../../assets/logostack44.png";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const Hero3D = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const frameRef = useRef<number | null>(null);
  const recoverTimerRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(0);
  const wasHiddenRef = useRef<boolean>(false);
  const lastRecoverAtRef = useRef<number>(0);

  const [videoKey, setVideoKey] = useState<number>(0);
  const [showText, setShowText] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const getRealScrollProgress = useCallback(() => {
    const container = containerRef.current;

    if (!container) return scrollYProgress.get();

    const rect = container.getBoundingClientRect();
    const totalScrollable = container.offsetHeight - window.innerHeight;

    if (totalScrollable <= 0) return 0;

    const progress = -rect.top / totalScrollable;

    return clamp(progress, 0, 1);
  }, [scrollYProgress]);

  const syncTextState = useCallback((progress: number, duration?: number) => {
    setHasScrolled(progress > 0.01);

    if (duration && Number.isFinite(duration) && duration > 0) {
      const currentTime = progress * duration;
      setShowText(currentTime >= 6.0);
    }
  }, []);

  const syncVideoToScroll = useCallback(
    (progress?: number, forceWake = false) => {
      const video = videoRef.current;

      if (!video) return;

      const finalProgress =
        typeof progress === "number" ? progress : getRealScrollProgress();

      lastProgressRef.current = finalProgress;

      if (video.readyState < 1) {
        video.load();
        return;
      }

      const duration = video.duration;

      if (!Number.isFinite(duration) || duration <= 0) return;

      const maxTime = Math.max(duration - 0.08, 0);
      const targetTime = clamp(finalProgress * duration, 0, maxTime);

      syncTextState(finalProgress, duration);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const currentVideo = videoRef.current;

        if (!currentVideo || !Number.isFinite(currentVideo.duration)) return;

        try {
          currentVideo.currentTime = targetTime;

          /**
           * Esto despierta el decodificador del video.
           * En algunos navegadores, después de volver de otra pestaña,
           * currentTime cambia internamente pero el frame visual no se actualiza.
           */
          if (forceWake) {
            const playPromise = currentVideo.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  window.setTimeout(() => {
                    const freshVideo = videoRef.current;

                    if (!freshVideo) return;

                    freshVideo.pause();
                    freshVideo.currentTime = targetTime;
                  }, 60);
                })
                .catch(() => {
                  currentVideo.pause();
                  currentVideo.currentTime = targetTime;
                });
            }
          }
        } catch {
          // Evita romper el componente si el navegador bloquea un seek puntual.
        }
      });
    },
    [getRealScrollProgress, syncTextState]
  );

  const recoverVideoAfterTabReturn = useCallback(() => {
    if (document.visibilityState !== "visible") return;

    const now = Date.now();

    /**
     * Evita disparar varias recuperaciones seguidas porque algunos navegadores
     * lanzan visibilitychange, focus y pageshow casi al mismo tiempo.
     */
    if (now - lastRecoverAtRef.current < 300) return;

    lastRecoverAtRef.current = now;

    const progress = getRealScrollProgress();

    lastProgressRef.current = progress;
    syncTextState(progress);

    /**
     * Solución fuerte:
     * Remontamos el video para reiniciar el decodificador interno.
     */
    setVideoKey((prev) => prev + 1);

    if (recoverTimerRef.current !== null) {
      window.clearTimeout(recoverTimerRef.current);
    }

    /**
     * Intento adicional por si el nuevo video ya alcanzó a montar.
     */
    recoverTimerRef.current = window.setTimeout(() => {
      syncVideoToScroll(lastProgressRef.current, true);
    }, 120);
  }, [getRealScrollProgress, syncTextState, syncVideoToScroll]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasHiddenRef.current = true;
        return;
      }

      if (document.visibilityState === "visible" && wasHiddenRef.current) {
        wasHiddenRef.current = false;
        recoverVideoAfterTabReturn();
      }
    };

    const handleFocus = () => {
      recoverVideoAfterTabReturn();
    };

    const handlePageShow = () => {
      recoverVideoAfterTabReturn();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [recoverVideoAfterTabReturn]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      if (recoverTimerRef.current !== null) {
        window.clearTimeout(recoverTimerRef.current);
      }
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    lastProgressRef.current = latest;

    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      setHasScrolled(latest > 0.01);
      return;
    }

    const currentTime = latest * video.duration;

    setHasScrolled(latest > 0.01);
    setShowText(currentTime >= 6.0);

    syncVideoToScroll(latest);
  });

  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0.9, 1], [0, -50]);

  const customTransition: Transition = {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] bg-[#05080a] m-0 p-0 flex flex-col"
    >
      <motion.div
        style={{ opacity, y, willChange: "opacity, transform" }}
        className="sticky top-0 w-full h-screen overflow-hidden m-0 p-0 z-0 flex items-center justify-center"
      >
        {/* Contenedor del Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#05080a]">
          <video
            key={videoKey}
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/videos/hero-3d.mp4"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onLoadedMetadata={() => {
              syncVideoToScroll(lastProgressRef.current || getRealScrollProgress(), true);
            }}
            onLoadedData={() => {
              syncVideoToScroll(lastProgressRef.current || getRealScrollProgress(), true);
            }}
            onCanPlay={() => {
              syncVideoToScroll(lastProgressRef.current || getRealScrollProgress(), true);
            }}
          />

          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_70%,_#05080a_100%)] opacity-70" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_100%_100%,_#05080a_0%,_#05080a_25%,_transparent_60%)]" />
        </div>

        {/* SPLASH SCREEN */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 1, backdropFilter: "blur(16px)" }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px)",
                scale: 1.05,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#05080a]/100"
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 1.2,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                src={logoSis}
                alt="SIS Sistema de Gestión"
                className="w-64 md:w-80 lg:w-80 object-contain drop-shadow-2xl"
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                className="absolute bottom-10 flex flex-col items-center gap-4 pointer-events-none"
              >
                <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-slate-400 font-medium drop-shadow-sm">
                  Desliza para comenzar
                </span>

                <div className="w-[1px] h-12 md:h-16 bg-slate-800/60 relative overflow-hidden rounded-full">
                  <motion.div
                    className="w-full h-1/3 bg-cyan-400 shadow-[0_0_8px_1px_rgba(34,211,238,0.8)]"
                    animate={{ y: ["-150%", "300%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: [0.65, 0, 0.35, 1],
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