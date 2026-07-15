// src/features/landing/components/Hero3D.tsx

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type Transition,
} from "framer-motion";

import { ShieldCheck } from "lucide-react";
import logoStack44 from "../../../assets/logostack44.png";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const STORAGE_KEY = "stack44:hero3d-state";
const LEGACY_STORAGE_KEY = "stack44:hero3d-progress";

const TEXT_START_SECONDS = 6;

/**
 * Evita pedir exactamente el último frame, donde algunos
 * navegadores pueden mostrar una imagen negra.
 */
const VIDEO_END_PADDING = 0.08;

/**
 * Solo se realiza un seek cuando cambia al menos un frame.
 * Esto reduce mucho el trabajo del decodificador en Chrome.
 */
const SEEK_THRESHOLD = 1 / 60;

/**
 * Protección máxima mientras el navegador vuelve a pintar
 * el video después de regresar a la pestaña.
 */
const RECOVERY_TIMEOUT = 320;

type StoredHeroState = {
  progress: number;
  currentTime: number;
};

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callbackId: number,
    callback: (now: number, metadata: VideoFrameMetadata) => void
  ) => number;
  cancelVideoFrameCallback?: (
    callbackId: number
  ) => void;
};

// Extensión de VideoFrameMetadata para TS si no está definida globalmente
interface VideoFrameMetadata {
  presentationTime: DOMHighResTimeStamp;
  expectedDisplayTime: DOMHighResTimeStamp;
  width: number;
  height: number;
  mediaTime: number;
  presentedFrames: number;
  processingDuration?: number;
  captureTime?: DOMHighResTimeStamp;
  receiveTime?: DOMHighResTimeStamp;
  rtpTimestamp?: number;
}

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max);

const getTargetTime = (
  progress: number,
  duration: number
) => {
  const maximumTime = Math.max(
    duration - VIDEO_END_PADDING,
    0
  );

  return clamp(
    progress * duration,
    0,
    maximumTime
  );
};

/* =========================================================
   COMPONENTE
========================================================= */

export const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const animationFrameRef = useRef<number | null>(null);
  const recoveryFrameRef = useRef<number | null>(null);
  const recoveryTimerRef = useRef<number | null>(null);
  const videoFrameCallbackRef = useRef<number | null>(null);

  /** Última posición solicitada por el scroll. */
  const latestProgressRef = useRef(0);

  /** Progreso recuperado al volver a montar el componente. */
  const restoredProgressRef = useRef<number | null>(null);

  /** Tiempo exacto guardado del video como respaldo. */
  const restoredTimeRef = useRef<number | null>(null);

  /** Permite solicitar nuevamente el mismo frame. */
  const forceSeekRef = useRef(false);

  const wasHiddenRef = useRef(false);

  /**
   * Evita setState durante cada evento de scroll.
   */
  const interfaceStateRef = useRef({
    hasScrolled: false,
    showText: false,
    videoReady: false,
    recovering: false,
  });

  const [hasScrolled, setHasScrolled] = useState(false);
  const [showText, setShowText] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [recovering, setRecovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* =======================================================
     SESSION STORAGE
  ======================================================= */

  const readStoredState = useCallback(
    (): StoredHeroState | null => {
      try {
        const storedState =
          window.sessionStorage.getItem(STORAGE_KEY);

        if (storedState) {
          const parsedState = JSON.parse(
            storedState
          ) as Partial<StoredHeroState>;

          const progress = Number(
            parsedState.progress
          );
          const currentTime = Number(
            parsedState.currentTime
          );

          if (Number.isFinite(progress)) {
            return {
              progress: clamp(progress, 0, 1),
              currentTime: Number.isFinite(
                currentTime
              )
                ? Math.max(currentTime, 0)
                : 0,
            };
          }
        }

        /** Compatibilidad con la versión anterior. */
        const legacyValue =
          window.sessionStorage.getItem(
            LEGACY_STORAGE_KEY
          );

        if (!legacyValue) {
          return null;
        }

        const legacyProgress = Number(legacyValue);

        if (!Number.isFinite(legacyProgress)) {
          return null;
        }

        return {
          progress: clamp(legacyProgress, 0, 1),
          currentTime: 0,
        };
      } catch {
        return null;
      }
    },
    []
  );

  const saveCurrentState = useCallback(() => {
    try {
      const video = videoRef.current;

      const currentTime =
        video && Number.isFinite(video.currentTime)
          ? Math.max(video.currentTime, 0)
          : 0;

      const state: StoredHeroState = {
        progress: clamp(
          latestProgressRef.current,
          0,
          1
        ),
        currentTime,
      };

      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch {
      // sessionStorage puede estar bloqueado.
    }
  }, []);

  /* =======================================================
     ESTADO DE INTERFAZ
  ======================================================= */

  const setReadyState = useCallback(
    (nextValue: boolean) => {
      if (
        interfaceStateRef.current.videoReady ===
        nextValue
      ) {
        return;
      }

      interfaceStateRef.current.videoReady =
        nextValue;
      setVideoReady(nextValue);
    },
    []
  );

  const setRecoveringState = useCallback(
    (nextValue: boolean) => {
      if (
        interfaceStateRef.current.recovering ===
        nextValue
      ) {
        return;
      }

      interfaceStateRef.current.recovering =
        nextValue;
      setRecovering(nextValue);
    },
    []
  );

  const updateInterfaceState = useCallback(
    (progress: number, duration?: number) => {
      const nextHasScrolled = progress > 0.01;

      if (
        interfaceStateRef.current.hasScrolled !==
        nextHasScrolled
      ) {
        interfaceStateRef.current.hasScrolled =
          nextHasScrolled;
        setHasScrolled(nextHasScrolled);
      }

      if (
        typeof duration !== "number" ||
        !Number.isFinite(duration) ||
        duration <= 0
      ) {
        return;
      }

      const nextShowText =
        progress * duration >= TEXT_START_SECONDS;

      if (
        interfaceStateRef.current.showText !==
        nextShowText
      ) {
        interfaceStateRef.current.showText =
          nextShowText;
        setShowText(nextShowText);
      }
    },
    []
  );

  /* =======================================================
     PROGRESO REAL DEL HERO
  ======================================================= */

  const getRealScrollProgress = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return clamp(scrollYProgress.get(), 0, 1);
    }

    const rect = container.getBoundingClientRect();
    const totalScrollable =
      container.offsetHeight - window.innerHeight;

    if (totalScrollable <= 0) {
      return 0;
    }

    return clamp(
      -rect.top / totalScrollable,
      0,
      1
    );
  }, [scrollYProgress]);

  const getPreferredProgress = useCallback(() => {
    const realProgress = getRealScrollProgress();

    if (realProgress > 0.005) {
      restoredProgressRef.current = null;
      restoredTimeRef.current = null;
      return realProgress;
    }

    if (restoredProgressRef.current !== null) {
      return restoredProgressRef.current;
    }

    return latestProgressRef.current;
  }, [getRealScrollProgress]);

  /* =======================================================
     CONTROL DEL FRAME PINTADO
  ======================================================= */

  const clearRecoveryTimer = useCallback(() => {
    if (recoveryTimerRef.current !== null) {
      window.clearTimeout(
        recoveryTimerRef.current
      );
      recoveryTimerRef.current = null;
    }
  }, []);

  const finishRecovery = useCallback(() => {
    clearRecoveryTimer();
    setReadyState(true);
    setRecoveringState(false);
  }, [
    clearRecoveryTimer,
    setReadyState,
    setRecoveringState,
  ]);

  /**
   * Espera a que el navegador realmente pinte un frame.
   * requestVideoFrameCallback funciona muy bien en Chrome y
   * Safari modernos. Se incluye un respaldo para versiones
   * anteriores.
   */
  const waitForPaintedVideoFrame = useCallback(() => {
    const video =
      videoRef.current as VideoWithFrameCallback | null;

    if (!video) {
      return;
    }

    if (
      videoFrameCallbackRef.current !== null &&
      video.cancelVideoFrameCallback
    ) {
      video.cancelVideoFrameCallback(
        videoFrameCallbackRef.current
      );
      videoFrameCallbackRef.current = null;
    }

    if (video.requestVideoFrameCallback) {
      videoFrameCallbackRef.current =
        video.requestVideoFrameCallback(() => {
          videoFrameCallbackRef.current = null;
          finishRecovery();
        });

      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        finishRecovery();
      });
    });
  }, [finishRecovery]);

  /* =======================================================
     SINCRONIZACIÓN DEL VIDEO
  ======================================================= */

  const applyScheduledVideoProgress =
    useCallback(() => {
      animationFrameRef.current = null;

      const progress = clamp(
        latestProgressRef.current,
        0,
        1
      );

      updateInterfaceState(progress);

      const video = videoRef.current;

      if (
        !video ||
        video.readyState <
          HTMLMediaElement.HAVE_METADATA
      ) {
        return;
      }

      const duration = video.duration;

      if (
        !Number.isFinite(duration) ||
        duration <= 0
      ) {
        return;
      }

      updateInterfaceState(progress, duration);

      let targetTime = getTargetTime(
        progress,
        duration
      );

      /**
       * Al restaurar el componente utilizamos el tiempo exacto
       * guardado, siempre que el scroll real siga arriba.
       */
      if (
        forceSeekRef.current &&
        restoredTimeRef.current !== null &&
        getRealScrollProgress() <= 0.005
      ) {
        targetTime = clamp(
          restoredTimeRef.current,
          0,
          Math.max(
            duration - VIDEO_END_PADDING,
            0
          )
        );
      }

      const difference = Math.abs(
        video.currentTime - targetTime
      );

      const mustForceSeek = forceSeekRef.current;
      forceSeekRef.current = false;

      if (
        !mustForceSeek &&
        difference < SEEK_THRESHOLD
      ) {
        return;
      }

      /**
       * No esperamos el evento seeked anterior. Chrome puede
       * cancelar el seek viejo y quedarse solamente con el
       * destino más reciente, evitando que el video se atrase
       * respecto al scroll.
       */
      try {
        video.currentTime = targetTime;
      } catch {
        // Evita romper la página durante un seek puntual.
      }
    }, [
      getRealScrollProgress,
      updateInterfaceState,
    ]);

  /**
   * Como máximo se solicita una actualización por frame de
   * pantalla, manteniendo el scroll fluido a 60 FPS.
   */
  const scheduleVideoSync = useCallback(
    (progress: number, forceSeek = false) => {
      latestProgressRef.current = clamp(
        progress,
        0,
        1
      );

      if (forceSeek) {
        forceSeekRef.current = true;
      }

      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current =
        window.requestAnimationFrame(
          applyScheduledVideoProgress
        );
    },
    [applyScheduledVideoProgress]
  );

  /* =======================================================
     RECUPERACIÓN AL REGRESAR A LA PESTAÑA
  ======================================================= */

  const repaintCurrentVideoFrame = useCallback(
    (progress: number) => {
      const video = videoRef.current;

      if (
        !video ||
        video.readyState < HTMLMediaElement.HAVE_METADATA ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        scheduleVideoSync(progress, true);
        return;
      }

      const maximumTime = Math.max(video.duration - VIDEO_END_PADDING, 0);
      const targetTime = getTargetTime(progress, video.duration);

      const nudgeTime =
        targetTime + 0.05 <= maximumTime
          ? targetTime + 0.05
          : Math.max(targetTime - 0.05, 0);

      const wakeUpDecoder = async () => {
        try {
          video.muted = true;
          await video.play();
          video.pause();
        } catch {
          // Ignoramos errores si el navegador bloquea el autoplay temporalmente
        } finally {
          video.currentTime = nudgeTime;

          if (recoveryFrameRef.current !== null) {
            window.cancelAnimationFrame(recoveryFrameRef.current);
          }

          recoveryFrameRef.current = window.requestAnimationFrame(() => {
            recoveryFrameRef.current = null;

            const currentVideo = videoRef.current;
            if (!currentVideo) {
              finishRecovery();
              return;
            }

            try {
              currentVideo.currentTime = targetTime;
            } catch {
              // El temporizador de respaldo finalizará la capa.
            }

            waitForPaintedVideoFrame();
          });
        }
      };

      wakeUpDecoder();
    },
    [finishRecovery, scheduleVideoSync, waitForPaintedVideoFrame]
  );

  const recoverVideoFrame = useCallback(() => {
    if (document.visibilityState !== "visible") {
      return;
    }

    const progress = getRealScrollProgress();

    latestProgressRef.current = progress;
    setRecoveringState(true);
    updateInterfaceState(progress);

    repaintCurrentVideoFrame(progress);

    clearRecoveryTimer();
    recoveryTimerRef.current = window.setTimeout(
      finishRecovery,
      RECOVERY_TIMEOUT
    );
  }, [
    clearRecoveryTimer,
    finishRecovery,
    getRealScrollProgress,
    repaintCurrentVideoFrame,
    setRecoveringState,
    updateInterfaceState,
  ]);

  /* =======================================================
     EVENTO DE SCROLL
  ======================================================= */

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latestProgress) => {
      /**
       * Framer Motion puede emitir 0 durante el montaje. No
       * dejamos que ese valor elimine el progreso restaurado.
       */
      if (
        restoredProgressRef.current !== null &&
        latestProgress < 0.001
      ) {
        return;
      }

      if (latestProgress > 0.001) {
        restoredProgressRef.current = null;
        restoredTimeRef.current = null;
      }

      scheduleVideoSync(latestProgress);
    }
  );

  /* =======================================================
     RESTAURACIÓN INICIAL
  ======================================================= */

  useEffect(() => {
    const storedState = readStoredState();

    if (!storedState) {
      return;
    }

    restoredProgressRef.current =
      storedState.progress;
    restoredTimeRef.current =
      storedState.currentTime;
    latestProgressRef.current =
      storedState.progress;

    updateInterfaceState(storedState.progress);
  }, [readStoredState, updateInterfaceState]);

  /* =======================================================
     VISIBILIDAD Y NAVEGACIÓN
  ======================================================= */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasHiddenRef.current = true;
        saveCurrentState();
        videoRef.current?.pause();
        return;
      }

      if (
        document.visibilityState === "visible" &&
        wasHiddenRef.current
      ) {
        wasHiddenRef.current = false;
        recoverVideoFrame();
      }
    };

    const handlePageShow = (
      event: PageTransitionEvent
    ) => {
      if (event.persisted) {
        recoverVideoFrame();
      }
    };

    const handlePageHide = () => {
      saveCurrentState();
      videoRef.current?.pause();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    window.addEventListener(
      "pageshow",
      handlePageShow
    );
    window.addEventListener(
      "pagehide",
      handlePageHide
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
      window.removeEventListener(
        "pagehide",
        handlePageHide
      );
    };
  }, [recoverVideoFrame, saveCurrentState]);

  /* =======================================================
     LIMPIEZA
  ======================================================= */

  useEffect(() => {
    return () => {
      saveCurrentState();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (recoveryFrameRef.current !== null) {
        window.cancelAnimationFrame(
          recoveryFrameRef.current
        );
      }

      clearRecoveryTimer();

      const video =
        videoRef.current as VideoWithFrameCallback | null;

      if (
        video &&
        videoFrameCallbackRef.current !== null &&
        video.cancelVideoFrameCallback
      ) {
        video.cancelVideoFrameCallback(
          videoFrameCallbackRef.current
        );
      }

      videoRef.current?.pause();
    };
  }, [clearRecoveryTimer, saveCurrentState]);

  /* =======================================================
     ANIMACIONES GENERALES
  ======================================================= */

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.9, 1],
    [1, 0]
  );

  const sectionY = useTransform(
    scrollYProgress,
    [0.9, 1],
    [0, -50]
  );

  const textTransition: Transition = {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1],
  };

  const showSplash =
    !hasScrolled || !videoReady || recovering;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={containerRef}
      className="relative flex h-[400vh] w-full flex-col bg-[#05080a]"
    >
      <motion.div
        style={{
          opacity: sectionOpacity,
          y: sectionY,
          willChange: "opacity, transform",
        }}
        className="sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#05080a]"
      >
        {/* VIDEO PRINCIPAL */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#05080a]">
          <video
            ref={videoRef}
            src="/videos/hero-3d.mp4"
            poster={logoStack44}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
            }}
            onLoadedMetadata={() => {
              const realProgress =
                getRealScrollProgress();

              const progress =
                realProgress > 0.005
                  ? realProgress
                  : restoredProgressRef.current ??
                    latestProgressRef.current;

              latestProgressRef.current = progress;
              scheduleVideoSync(progress, true);
            }}
            onLoadedData={() => {
              const progress = getPreferredProgress();

              scheduleVideoSync(progress, true);
              waitForPaintedVideoFrame();
            }}
            onCanPlay={() => {
              if (!interfaceStateRef.current.videoReady) {
                waitForPaintedVideoFrame();
              }
            }}
            onSeeked={() => {
              if (
                recovering ||
                !interfaceStateRef.current.videoReady
              ) {
                waitForPaintedVideoFrame();
              }
            }}
            onError={() => {
              clearRecoveryTimer();
              setReadyState(false);
              setRecoveringState(false);
            }}
          />

          {/* REFACTORIZADO: Nuevo sistema de viñeta orgánica y "Humo" difuminado */}
          
          {/* Capa 1: Viñeta de cine base. Un degradado radial muy suave que oscurece sutilmente los bordes de TODO el video. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_85%,_rgba(5,8,10,0.4)_100%)] opacity-80" />

          {/* Capa 2: Degradado radial superpuesto y extremadamente suave que parte desde la esquina inferior derecha. Su falloff es muy amplio para integrarse de forma nebulosa. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(5,8,10,0.3)_0%,_rgba(5,8,10,0.2)_20%,_transparent_60%)] opacity-90 z-10" />

          {/* Capa 3: Una máscara de "humo" nebulosa y profunda focalizada en la zona de la marca de agua. Utiliza múltiples degradados superpuestos con muy baja opacidad para crear profundidad orgánica. */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-96 w-[600px] opacity-98" style={{
            background: `
              radial-gradient(ellipse at bottom right, rgba(5,8,10,0.95) 30%, rgba(5,8,10,0.85) 10%, transparent 60%),
              radial-gradient(ellipse at center 80%, rgba(5,8,10,0.7) 0%, rgba(5,8,10,0.5) 20%, transparent 70%),
              radial-gradient(ellipse at 80% bottom, rgba(5,8,10,0.6) 0%, rgba(5,8,10,0.4) 10%, transparent 70%)
            `
          }} />
        </div>

        {/* SPLASH Y PROTECCIÓN CONTRA PANTALLA NEGRA */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.015,
              }}
              transition={{
                duration: 0.28,
                ease: "easeOut",
              }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#05080a]"
            >
              <motion.img
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                src={logoStack44}
                alt="Stack44"
                decoding="async"
                draggable={false}
                className="w-64 select-none object-contain md:w-80"
              />

              {!hasScrolled && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.35,
                    ease: "easeOut",
                  }}
                  className="pointer-events-none absolute bottom-10 flex flex-col items-center gap-4"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-slate-400 md:text-xs">
                    Desliza para comenzar
                  </span>

                  <div className="relative h-12 w-px overflow-hidden rounded-full bg-slate-800/60 md:h-16">
                    <motion.div
                      animate={{
                        y: ["-150%", "300%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: [0.65, 0, 0.35, 1],
                      }}
                      className="h-1/3 w-full bg-cyan-400 shadow-[0_0_8px_1px_rgba(34,211,238,0.8)]"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENIDO LATERAL */}
        <div className="pointer-events-none absolute right-6 top-1/2 z-10 w-full max-w-lg -translate-y-1/2 md:right-24 md:max-w-xl lg:right-32 xl:right-40">
          <AnimatePresence mode="wait">
            {showText && videoReady && !recovering && (
              <motion.div
                key="main-text"
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                 opacity: 0,
                  x: -40,
                }}
                transition={textTransition}
                style={{
                  willChange: "opacity, transform",
                }}
                className="flex flex-col items-end text-right"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-[#0c131a] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300">
                  <ShieldCheck
                    size={14}
                    className="text-cyan-400"
                  />

                  Decreto 1072 &amp; Res. 0312
                </div>

                <h2 className="mb-4 text-5xl font-bold leading-[1.05] tracking-tighter text-white sm:text-6xl md:text-7xl md:leading-[1.1]">
                  Cumplimiento Legal.
                  <br />

                  <span className="bg-gradient-to-r from-slate-200 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Sin Complicaciones.
                  </span>
                </h2>

                <p className="max-w-md text-[17px] font-medium leading-relaxed tracking-tight text-slate-400/90 sm:text-lg md:text-xl lg:text-2xl">
                  Automatiza las inspecciones y gestiona
                  riesgos en tiempo real.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};