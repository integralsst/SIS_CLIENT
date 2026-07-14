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

const STORAGE_KEY = "stack44:hero3d-progress";

const TEXT_START_SECONDS = 6;

/**
 * Evita solicitar exactamente el último frame.
 * Algunos navegadores pueden mostrar negro al final.
 */
const VIDEO_END_PADDING = 0.06;

/**
 * Aproximadamente medio frame a 60 FPS.
 * Evita seeks innecesarios demasiado pequeños.
 */
const SEEK_THRESHOLD = 1 / 120;

/**
 * Tiempo máximo durante el cual se muestra la protección
 * visual al regresar desde otra pestaña.
 */
const RECOVERY_TIMEOUT = 220;

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max);

/* =========================================================
   COMPONENTE
========================================================= */

export const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const animationFrameRef = useRef<number | null>(null);
  const recoveryTimerRef = useRef<number | null>(null);
  const safariWakeFrameRef = useRef<number | null>(null);

  /**
   * Última posición solicitada por el scroll.
   */
  const latestProgressRef = useRef(0);

  /**
   * Progreso recuperado desde sessionStorage.
   *
   * Mientras tenga un valor distinto de null, evitamos que
   * una emisión inicial de scrollYProgress = 0 sobrescriba
   * la posición recuperada.
   */
  const restoredProgressRef = useRef<number | null>(null);

  /**
   * Chrome:
   * indica que hubo un nuevo progreso mientras el navegador
   * todavía estaba procesando el seek anterior.
   */
  const seekPendingRef = useRef(false);

  /**
   * Fuerza una actualización después de recuperar la pestaña.
   */
  const forceSeekRef = useRef(false);

  const wasHiddenRef = useRef(false);
  const hasLoadedVideoRef = useRef(false);

  /**
   * Evita ejecutar setState en cada evento del scroll.
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
     DETECCIÓN DE SAFARI
  ======================================================= */

  const isSafari = useCallback(() => {
    const userAgent = navigator.userAgent;

    return (
      /Safari/i.test(userAgent) &&
      !/Chrome|Chromium|CriOS|Edg|OPR|Android/i.test(
        userAgent
      )
    );
  }, []);

  /* =======================================================
     SESSION STORAGE
  ======================================================= */

  const readStoredProgress = useCallback(() => {
    try {
      const storedValue =
        window.sessionStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        return null;
      }

      const parsedValue = Number(storedValue);

      if (!Number.isFinite(parsedValue)) {
        return null;
      }

      return clamp(parsedValue, 0, 1);
    } catch {
      return null;
    }
  }, []);

  const saveCurrentProgress = useCallback(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        String(
          clamp(
            latestProgressRef.current,
            0,
            1
          )
        )
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
    (
      progress: number,
      duration?: number
    ) => {
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
        progress * duration >=
        TEXT_START_SECONDS;

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
     PROGRESO DEL HERO
  ======================================================= */

  const getRealScrollProgress = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return clamp(scrollYProgress.get(), 0, 1);
    }

    const rect =
      container.getBoundingClientRect();

    const totalScrollable =
      container.offsetHeight -
      window.innerHeight;

    if (totalScrollable <= 0) {
      return 0;
    }

    return clamp(
      -rect.top / totalScrollable,
      0,
      1
    );
  }, [scrollYProgress]);

  /**
   * Prioriza la posición real del scroll.
   *
   * Cuando el navegador está en la parte superior y existe
   * una posición restaurada, utiliza esa posición guardada.
   */
  const getPreferredProgress = useCallback(() => {
    const realProgress =
      getRealScrollProgress();

    if (realProgress > 0.005) {
      restoredProgressRef.current = null;
      return realProgress;
    }

    if (restoredProgressRef.current !== null) {
      return restoredProgressRef.current;
    }

    return latestProgressRef.current;
  }, [getRealScrollProgress]);

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

      const maximumTime = Math.max(
        duration - VIDEO_END_PADDING,
        0
      );

      const targetTime = clamp(
        progress * duration,
        0,
        maximumTime
      );

      /**
       * Chrome no procesa bien una cadena continua de
       * currentTime mientras sigue buscando el frame anterior.
       *
       * Guardamos solamente la posición más reciente y
       * esperamos el evento seeked.
       */
      if (video.seeking) {
        seekPendingRef.current = true;
        return;
      }

      const difference = Math.abs(
        video.currentTime - targetTime
      );

      const mustForceSeek =
        forceSeekRef.current;

      forceSeekRef.current = false;

      if (
        !mustForceSeek &&
        difference < SEEK_THRESHOLD
      ) {
        return;
      }

      seekPendingRef.current = false;

      try {
        video.currentTime = targetTime;
      } catch {
        // Evita romper la página durante un seek puntual.
      }
    }, [updateInterfaceState]);

  /**
   * Agrupa todos los eventos del scroll y ejecuta como
   * máximo una actualización por frame de pantalla.
   */
  const scheduleVideoSync = useCallback(
    (
      progress: number,
      forceSeek = false
    ) => {
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
     RECUPERACIÓN AL VOLVER DE OTRA PESTAÑA
  ======================================================= */

  const finishRecovery = useCallback(() => {
    if (recoveryTimerRef.current !== null) {
      window.clearTimeout(
        recoveryTimerRef.current
      );

      recoveryTimerRef.current = null;
    }

    setReadyState(true);
    setRecoveringState(false);
  }, [setReadyState, setRecoveringState]);

  /**
   * Safari puede recordar currentTime internamente, pero no
   * volver a pintar el frame al regresar desde otra pestaña.
   *
   * Solo Safari utiliza este pequeño play/pause.
   * Chrome no lo ejecuta durante la recuperación.
   */
  const wakeSafariDecoder = useCallback(
    (progress: number) => {
      if (!isSafari()) {
        return;
      }

      const video = videoRef.current;

      if (
        !video ||
        video.readyState <
          HTMLMediaElement.HAVE_CURRENT_DATA ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return;
      }

      const maximumTime = Math.max(
        video.duration - VIDEO_END_PADDING,
        0
      );

      const targetTime = clamp(
        progress * video.duration,
        0,
        maximumTime
      );

      video.pause();

      try {
        video.currentTime = targetTime;
      } catch {
        return;
      }

      const playPromise = video.play();

      if (!playPromise) {
        return;
      }

      playPromise
        .then(() => {
          if (
            safariWakeFrameRef.current !== null
          ) {
            window.cancelAnimationFrame(
              safariWakeFrameRef.current
            );
          }

          safariWakeFrameRef.current =
            window.requestAnimationFrame(() => {
              const currentVideo =
                videoRef.current;

              if (!currentVideo) {
                return;
              }

              currentVideo.pause();

              try {
                currentVideo.currentTime =
                  targetTime;
              } catch {
                // Sin acción adicional.
              }

              finishRecovery();
            });
        })
        .catch(() => {
          /**
           * Respaldo para Safari cuando play() es bloqueado.
           */
          try {
            video.currentTime = Math.min(
              targetTime + 0.002,
              maximumTime
            );

            safariWakeFrameRef.current =
              window.requestAnimationFrame(() => {
                const currentVideo =
                  videoRef.current;

                if (!currentVideo) {
                  return;
                }

                try {
                  currentVideo.currentTime =
                    targetTime;
                } catch {
                  // Sin acción adicional.
                }

                finishRecovery();
              });
          } catch {
            finishRecovery();
          }
        });
    },
    [finishRecovery, isSafari]
  );

  const recoverVideoFrame = useCallback(() => {
    if (
      document.visibilityState !== "visible"
    ) {
      return;
    }

    const progress =
      getPreferredProgress();

    latestProgressRef.current = progress;

    setRecoveringState(true);
    updateInterfaceState(progress);

    scheduleVideoSync(progress, true);

    /**
     * Safari recibe un despertar especial.
     * Chrome espera normalmente a que termine el seek.
     */
    wakeSafariDecoder(progress);

    if (recoveryTimerRef.current !== null) {
      window.clearTimeout(
        recoveryTimerRef.current
      );
    }

    /**
     * Respaldo para evitar que la capa protectora quede
     * visible si el navegador no dispara seeked.
     */
    recoveryTimerRef.current =
      window.setTimeout(() => {
        finishRecovery();
      }, RECOVERY_TIMEOUT);
  }, [
    finishRecovery,
    getPreferredProgress,
    scheduleVideoSync,
    setRecoveringState,
    updateInterfaceState,
    wakeSafariDecoder,
  ]);

  /* =======================================================
     EVENTO DE SCROLL
  ======================================================= */

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latestProgress) => {
      /**
       * Evita que un cero emitido durante el montaje
       * sobrescriba la posición restaurada.
       */
      if (
        restoredProgressRef.current !== null &&
        latestProgress < 0.001
      ) {
        return;
      }

      if (latestProgress > 0.001) {
        restoredProgressRef.current = null;
      }

      scheduleVideoSync(latestProgress);
    }
  );

  /* =======================================================
     RESTAURACIÓN INICIAL
  ======================================================= */

  useEffect(() => {
    const storedProgress =
      readStoredProgress();

    if (storedProgress === null) {
      return;
    }

    restoredProgressRef.current =
      storedProgress;

    latestProgressRef.current =
      storedProgress;

    updateInterfaceState(storedProgress);
  }, [
    readStoredProgress,
    updateInterfaceState,
  ]);

  /* =======================================================
     VISIBILIDAD Y NAVEGACIÓN
  ======================================================= */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden"
      ) {
        wasHiddenRef.current = true;

        saveCurrentProgress();
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
      /**
       * Se ejecuta cuando la página vuelve desde BFCache.
       */
      if (event.persisted) {
        recoverVideoFrame();
      }
    };

    const handlePageHide = () => {
      saveCurrentProgress();
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
  }, [
    recoverVideoFrame,
    saveCurrentProgress,
  ]);

  /* =======================================================
     LIMPIEZA
  ======================================================= */

  useEffect(() => {
    return () => {
      saveCurrentProgress();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (recoveryTimerRef.current !== null) {
        window.clearTimeout(
          recoveryTimerRef.current
        );
      }

      if (
        safariWakeFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          safariWakeFrameRef.current
        );
      }

      videoRef.current?.pause();
    };
  }, [saveCurrentProgress]);

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

  /**
   * La capa inicial permanece mientras:
   * - el usuario todavía no ha hecho scroll;
   * - el video todavía no entregó un frame;
   * - el navegador está recuperando el decodificador.
   */
  const showSplash =
    !hasScrolled ||
    !videoReady ||
    recovering;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={containerRef}
      className="
        relative
        flex
        h-[400vh]
        w-full
        flex-col
        bg-[#05080a]
      "
    >
      <motion.div
        style={{
          opacity: sectionOpacity,
          y: sectionY,
          willChange: "opacity, transform",
        }}
        className="
          sticky
          top-0
          z-0
          flex
          h-screen
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-[#05080a]
        "
      >
        {/* VIDEO PRINCIPAL */}
        <div
          className="
            absolute
            inset-0
            z-0
            h-full
            w-full
            overflow-hidden
            bg-[#05080a]
          "
        >
          <video
            ref={videoRef}
            src="/videos/hero-3d.mp4"
            poster={logoStack44}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className="
              h-full
              w-full
              object-cover
            "
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              willChange: "transform",
            }}
            onLoadedMetadata={() => {
              const realProgress =
                getRealScrollProgress();

              const progress =
                realProgress > 0.005
                  ? realProgress
                  : restoredProgressRef.current ??
                    latestProgressRef.current;

              latestProgressRef.current =
                progress;

              scheduleVideoSync(
                progress,
                true
              );
            }}
            onLoadedData={() => {
              if (!hasLoadedVideoRef.current) {
                hasLoadedVideoRef.current = true;
                setReadyState(true);
              }

              scheduleVideoSync(
                getPreferredProgress(),
                true
              );
            }}
            onSeeked={() => {
              setReadyState(true);
              setRecoveringState(false);

              /**
               * Si el usuario continuó desplazándose mientras
               * Chrome buscaba el frame anterior, aplicamos
               * directamente la posición más reciente.
               */
              if (seekPendingRef.current) {
                seekPendingRef.current = false;

                scheduleVideoSync(
                  latestProgressRef.current,
                  true
                );
              }
            }}
            onError={() => {
              setReadyState(false);
              setRecoveringState(false);
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(ellipse_at_center,_transparent_70%,_#05080a_100%)]
              opacity-70
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_100%_100%,_#05080a_0%,_#05080a_25%,_transparent_60%)]
            "
          />
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
                duration: 0.35,
                ease: "easeOut",
              }}
              className="
                absolute
                inset-0
                z-30
                flex
                flex-col
                items-center
                justify-center
                bg-[#05080a]
              "
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
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                src={logoStack44}
                alt="Stack44"
                decoding="async"
                draggable={false}
                className="
                  w-64
                  select-none
                  object-contain
                  md:w-80
                "
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
                    duration: 0.65,
                    delay: 0.55,
                    ease: "easeOut",
                  }}
                  className="
                    pointer-events-none
                    absolute
                    bottom-10
                    flex
                    flex-col
                    items-center
                    gap-4
                  "
                >
                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.5em]
                      text-slate-400
                      md:text-xs
                    "
                  >
                    Desliza para comenzar
                  </span>

                  <div
                    className="
                      relative
                      h-12
                      w-px
                      overflow-hidden
                      rounded-full
                      bg-slate-800/60
                      md:h-16
                    "
                  >
                    <motion.div
                      animate={{
                        y: ["-150%", "300%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: [
                          0.65,
                          0,
                          0.35,
                          1,
                        ],
                      }}
                      className="
                        h-1/3
                        w-full
                        bg-cyan-400
                        shadow-[0_0_8px_1px_rgba(34,211,238,0.8)]
                      "
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENIDO LATERAL */}
        <div
          className="
            pointer-events-none
            absolute
            right-6
            top-1/2
            z-10
            w-full
            max-w-lg
            -translate-y-1/2
            md:right-24
            md:max-w-xl
            lg:right-32
            xl:right-40
          "
        >
          <AnimatePresence mode="wait">
            {showText &&
              videoReady &&
              !recovering && (
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
                    willChange:
                      "opacity, transform",
                  }}
                  className="
                    flex
                    flex-col
                    items-end
                    text-right
                  "
                >
                  <div
                    className="
                      mb-6
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-cyan-500/20
                      bg-[#0c131a]
                      px-4
                      py-1.5
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-slate-300
                    "
                  >
                    <ShieldCheck
                      size={14}
                      className="text-cyan-400"
                    />

                    Decreto 1072 &amp; Res. 0312
                  </div>

                  <h2
                    className="
                      mb-4
                      text-5xl
                      font-bold
                      leading-[1.05]
                      tracking-tighter
                      text-white
                      sm:text-6xl
                      md:text-7xl
                      md:leading-[1.1]
                    "
                  >
                    Cumplimiento Legal.
                    <br />

                    <span
                      className="
                        bg-gradient-to-r
                        from-slate-200
                        via-cyan-400
                        to-blue-500
                        bg-clip-text
                        text-transparent
                      "
                    >
                      Sin Complicaciones.
                    </span>
                  </h2>

                  <p
                    className="
                      max-w-md
                      text-[17px]
                      font-medium
                      leading-relaxed
                      tracking-tight
                      text-slate-400/90
                      sm:text-lg
                      md:text-xl
                      lg:text-2xl
                    "
                  >
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