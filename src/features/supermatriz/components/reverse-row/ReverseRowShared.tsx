import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Layers3,
  Route,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";

import type {
  BuilderEntityMode,
} from "../../types/supermatriz.types";
import type {
  ReverseRowStep,
} from "./reverseRow.types";

export const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50";

export const steps: Array<{
  id: ReverseRowStep;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  {
    id: 1,
    label: "Aspecto",
    description: "Qué se evaluará",
    icon: ClipboardCheck,
  },
  {
    id: 2,
    label: "Estándar",
    description: "Dónde se agrupa",
    icon: FileText,
  },
  {
    id: 3,
    label: "Categoría",
    description: "Nivel organizador",
    icon: Layers3,
  },
  {
    id: 4,
    label: "Ciclo PHVA",
    description: "Nivel superior",
    icon: Route,
  },
  {
    id: 5,
    label: "Proceso",
    description: "Cómo se atiende",
    icon: Workflow,
  },
  {
    id: 6,
    label: "Fila",
    description: "Conectar y guardar",
    icon: CheckCircle2,
  },
];

export function StepNavigator({
  current,
  onSelect,
}: {
  current: ReverseRowStep;
  onSelect: (step: ReverseRowStep) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {steps.map((item) => {
        const Icon = item.icon;
        const active = item.id === current;
        const completed = item.id < current;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id <= current) {
                onSelect(item.id);
              }
            }}
            className={`rounded-xl border p-3 text-left transition ${
              active
                ? "border-cyan-500/30 bg-cyan-500/10"
                : completed
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-neutral-800 bg-[#090909]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  active
                    ? "bg-cyan-500/10 text-cyan-300"
                    : completed
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-neutral-800 text-neutral-600"
                }`}
              >
                {completed ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Icon size={16} />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Paso {item.id}
                </p>
                <p
                  className={`truncate text-xs font-semibold ${
                    active
                      ? "text-cyan-200"
                      : "text-neutral-300"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function StepHeader({
  step,
}: {
  step: ReverseRowStep;
}) {
  const item = steps[step - 1];
  const Icon = item.icon;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-white">
            {step}. {item.label}
          </p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {step === 1
              ? "Comienza por el punto exacto que deseas evaluar. Si es nuevo, lo conservaremos como borrador hasta el último paso."
              : step === 2
                ? "Define el estándar que contendrá el aspecto. Puede ser uno existente o uno nuevo."
                : step === 3
                  ? "Ubica el estándar dentro de una categoría. Si la ruta ya viene definida, solo debes revisarla."
                  : step === 4
                    ? "Relaciona la categoría con el ciclo PHVA correspondiente."
                    : step === 5
                      ? "Selecciona o define el proceso mediante el cual se trabajará el aspecto."
                      : "Completa la información operativa, selecciona las gestiones y guarda toda la conexión en una sola transacción."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ModeSwitch({
  value,
  onChange,
  existingLabel = "Usar existente",
  newLabel = "Crear nuevo",
}: {
  value: BuilderEntityMode;
  onChange: (mode: BuilderEntityMode) => void;
  existingLabel?: string;
  newLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 rounded-xl border border-neutral-800 bg-[#080808] p-1">
      <button
        type="button"
        onClick={() => onChange("EXISTENTE")}
        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
          value === "EXISTENTE"
            ? "bg-neutral-800 text-white"
            : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        {existingLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("NUEVO")}
        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
          value === "NUEVO"
            ? "bg-cyan-500/10 text-cyan-200"
            : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        {newLabel}
      </button>
    </div>
  );
}

export function Field({
  label,
  help,
  children,
  spanTwo = false,
}: {
  label: string;
  help?: string;
  children: ReactNode;
  spanTwo?: boolean;
}) {
  return (
    <label className={spanTwo ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-medium text-neutral-300">
        {label}
      </span>
      {children}
      {help && (
        <span className="mt-1.5 block text-[11px] leading-5 text-neutral-600">
          {help}
        </span>
      )}
    </label>
  );
}

export function InheritedCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <section className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.045] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {label} heredado
          </p>
          <h3 className="mt-2 text-sm font-semibold leading-6 text-white">
            {value}
          </h3>
          {detail && (
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              {detail}
            </p>
          )}
        </div>
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
      </div>
    </section>
  );
}

export function ConnectionPath({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
  }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-2"
        >
          <div className="rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
              {item.label}
            </p>
            <p className="mt-1 max-w-[260px] truncate text-xs text-neutral-300">
              {item.value || "Pendiente"}
            </p>
          </div>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-neutral-700" />
          )}
        </div>
      ))}
    </div>
  );
}
