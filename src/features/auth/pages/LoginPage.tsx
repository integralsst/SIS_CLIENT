import {
  useState,
  type FormEvent,
} from "react";

import {
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useAuth,
  type LoginResponse,
} from "../context/AuthContext";

import Logo from "../../../assets/logosis.webp";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000"
).replace(/\/$/, "");

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const contentType =
    response.headers.get("content-type");

  if (
    contentType?.includes("application/json")
  ) {
    return (await response.json()) as T;
  }

  const text = await response.text();

  throw new Error(
    text ||
      "El servidor respondió en un formato inesperado."
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      if (!normalizedEmail || !password) {
        throw new Error(
          "Ingresa tu correo y contraseña."
        );
      }

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await parseResponse<ApiErrorResponse>(
            response
          );

        throw new Error(
          errorData.error ||
            errorData.message ||
            "No fue posible iniciar sesión."
        );
      }

      const data =
        await parseResponse<LoginResponse>(
          response
        );

      if (!data.token || !data.user) {
        throw new Error(
          "La respuesta del servidor no contiene una sesión válida."
        );
      }

      login(data.user, data.token);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Ocurrió un error al iniciar sesión.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05080a] px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[150px]" />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-[420px] rounded-[2.5rem] border border-white/5 bg-[#0a0a0a]/80 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <img
              src={Logo}
              alt="Stack44"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bienvenido de nuevo
          </h1>

          <p className="text-sm font-medium text-slate-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key={error}
              initial={{
                opacity: 0,
                height: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -8,
              }}
              role="alert"
              className="mb-6 overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs font-medium text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400"
            >
              Correo electrónico
            </label>

            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
              </div>

              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError(null);
                  }
                }}
                placeholder="ejemplo@empresa.com"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isLoading}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="ml-1 flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
              >
                Contraseña
              </label>

              <button
                type="button"
                className="text-[11px] font-bold text-cyan-500 transition-colors hover:text-cyan-400"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
              </div>

              <input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (error) {
                    setError(null);
                  }
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm tracking-widest text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-600 to-blue-600 py-4 font-bold text-white shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="mt-8 space-y-6 text-center">
          <p className="text-sm text-slate-400">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-bold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Regístrate gratis
            </Link>
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}