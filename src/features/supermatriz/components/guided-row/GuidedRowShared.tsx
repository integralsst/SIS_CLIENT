import {
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Layers3,
  Loader2,
  Pencil,
  Plus,
  Route,
  Settings2,
  Workflow,
  X,
} from "lucide-react";
import type {
  FormEvent,
  ReactNode,
} from "react";

import AppSelect from "../../../../components/ui/AppSelect";
import type {
  GuidedRowStep,
} from "./guidedRow.types";

export const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

export const guidedRowSteps: Array<{
  id: GuidedRowStep;
  title: string;
  short: string;
  explanation: string;
  icon: typeof Route;
}> = [
  {
    id: 1,
    title: "Ubica la fila en la estructura",
    short: "Ruta",
    explanation:
      "Selecciona o crea el ciclo PHVA, la categoría y el estándar. Así se define de dónde nace el aspecto.",
    icon: Route,
  },
  {
    id: 2,
    title: "Define qué se va a evaluar",
    short: "Aspecto",
    explanation:
      "Selecciona un aspecto existente o créalo con su plan de acción y periodicidad básica.",
    icon: ClipboardCheck,
  },
  {
    id: 3,
    title: "Indica desde qué proceso se trabajará",
    short: "Proceso",
    explanation:
      "El proceso es la forma administrativa de organizar la ejecución. Puede repetirse en muchas filas.",
    icon: Workflow,
  },
  {
    id: 4,
    title: "Explica cómo se ejecutará",
    short: "Operación",
    explanation:
      "Agrega la guía de ejecución, soportes, responsable, metas y recursos de esta fila.",
    icon: FileText,
  },
  {
    id: 5,
    title: "Clasifica y confirma",
    short: "Confirmar",
    explanation:
      "Selecciona las categorías de gestión y revisa la conexión completa antes de guardar.",
    icon: Layers3,
  },
];

export function StepNavigator({
  currentStep,
  onSelect,
}: {
  currentStep: GuidedRowStep;
  onSelect: (step: GuidedRowStep) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {guidedRowSteps.map((item) => {
        const Icon = item.icon;
        const active =
          currentStep === item.id;
        const completed =
          currentStep > item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onSelect(item.id)
            }
            className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
              active
                ? "border-cyan-500/30 bg-cyan-500/10"
                : completed
                  ? "border-emerald-500/15 bg-emerald-500/5"
                  : "border-neutral-800 bg-[#090909]"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                completed
                  ? "bg-emerald-500/10 text-emerald-400"
                  : active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "bg-neutral-800 text-neutral-600"
              }`}
            >
              {completed ? (
                <Check size={14} />
              ) : (
                <Icon size={14} />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                Paso {item.id}
              </p>
              <p
                className={`truncate text-[11px] font-medium ${
                  active
                    ? "text-cyan-200"
                    : "text-neutral-400"
                }`}
              >
                {item.short}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function StepIntro({
  step,
}: {
  step: GuidedRowStep;
}) {
  const current = guidedRowSteps[step - 1];
  const Icon = current.icon;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {current.title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {current.explanation}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SelectionBlock({
  number,
  title,
  explanation,
  value,
  onChange,
  onCreate,
  onEdit,
  disabled = false,
  children,
}: {
  number: string;
  title: string;
  explanation: string;
  value: string;
  onChange: (value: string) => void;
  onCreate?: () => void;
  onEdit?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border p-4 ${
        disabled
          ? "border-neutral-900 bg-[#0a0a0a] opacity-60"
          : "border-neutral-800 bg-[#0d0d0d]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xs font-bold text-cyan-400">
            {number}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-neutral-600">
              {explanation}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] lg:w-[55%]">
          <AppSelect
            value={value}
            disabled={disabled}
            onChange={(event) =>
              onChange(event.target.value)
            }
          >
            {children}
          </AppSelect>

          <div className="flex gap-2">
            {onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/15 sm:flex-none"
              >
                <Plus size={14} />
                Crear
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex min-h-10 items-center justify-center rounded-xl border border-neutral-800 px-3 text-neutral-500 transition hover:bg-neutral-800 hover:text-white"
                title={`Editar ${title.toLowerCase()}`}
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuickEditorShell({
  title,
  description,
  saving,
  error,
  onCancel,
  onSubmit,
  children,
}: {
  title: string;
  description: string;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-cyan-500/20 bg-[#071013] p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3 border-b border-cyan-500/10 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Settings2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              {description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg p-1.5 text-neutral-600 transition hover:bg-neutral-800 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-4">
        {children}
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black disabled:opacity-50"
        >
          {saving && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Guardar y seleccionar
        </button>
      </div>
    </form>
  );
}

export function PathPreview({
  items,
}: {
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.035] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
        Ruta seleccionada
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-2"
          >
            <span className="rounded-lg border border-neutral-800 bg-[#090909] px-3 py-2 text-xs text-neutral-300">
              {item}
            </span>
            {index < items.length - 1 && (
              <ChevronRight
                size={14}
                className="text-neutral-700"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Field({
  label,
  help,
  spanTwo = false,
  children,
}: {
  label: string;
  help?: string;
  spanTwo?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={
        spanTwo ? "md:col-span-2" : ""
      }
    >
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
      {help && (
        <span className="mt-1.5 block text-[10px] leading-4 text-neutral-600">
          {help}
        </span>
      )}
    </label>
  );
}

export function ToggleButton({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-xs transition ${
        checked
          ? "border-cyan-500/25 bg-cyan-500/10 text-cyan-200"
          : "border-neutral-800 bg-[#090909] text-neutral-500"
      }`}
    >
      {label}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          checked
            ? "border-cyan-400 bg-cyan-400 text-black"
            : "border-neutral-700"
        }`}
      >
        {checked && <Check size={12} />}
      </span>
    </button>
  );
}

export function ReviewItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#090909] p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-1 line-clamp-3 text-xs leading-5 text-neutral-300">
        {value || "Sin información"}
      </p>
    </div>
  );
}

export function SmallPill({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-full border border-neutral-800 bg-[#090909] px-2.5 py-1 text-neutral-400">
      {text}
    </span>
  );
}
