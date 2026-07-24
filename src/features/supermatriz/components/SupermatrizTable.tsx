import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Edit2,
  Eye,
  FileText,
  Loader2,
  Route,
  Settings2,
  ShieldCheck,
  Trash2,
  Workflow,
} from "lucide-react";
import {
  useState,
  type ReactNode,
} from "react";

import type {
  AspectCatalog,
  MatrixTask,
  PhvaCycle,
  ProcessCatalog,
  Standard,
  StandardCategory,
} from "../types/supermatriz.types";
import StatusBadge from "./StatusBadge";

interface Props {
  tasks: MatrixTask[];
  processes: ProcessCatalog[];
  loading: boolean;
  canEdit: boolean;
  deactivatingTaskId?: number | null;
  onView: (task: MatrixTask) => void;
  onEdit: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
  onEditCycle: (cycle: PhvaCycle) => void;
  onEditCategory: (
    category: StandardCategory
  ) => void;
  onEditStandard: (
    standard: Standard
  ) => void;
  onEditAspect: (
    aspect: AspectCatalog
  ) => void;
  onEditProcess: (
    process: ProcessCatalog
  ) => void;
}

export default function SupermatrizTable({
  tasks,
  processes,
  loading,
  canEdit,
  deactivatingTaskId = null,
  onView,
  onEdit,
  onDeactivate,
  onEditCycle,
  onEditCategory,
  onEditStandard,
  onEditAspect,
  onEditProcess,
}: Props) {
  const [expandedIds, setExpandedIds] =
    useState<number[]>([]);

  const initialLoading =
    loading && tasks.length === 0;
  const refreshing =
    loading && tasks.length > 0;

  function toggleExpanded(id: number) {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  return (
    <section
      aria-busy={loading}
      className="relative space-y-3"
    >
      {refreshing && (
        <div className="sticky top-3 z-30 mx-auto flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-[#071013]/95 px-4 py-2 text-xs font-medium text-cyan-300 shadow-xl backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin" />
          Actualizando filas…
        </div>
      )}

      {initialLoading ? (
        <LoadingState />
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        tasks.map((task) => {
          const expanded =
            expandedIds.includes(task.id);
          const isDeactivating =
            deactivatingTaskId === task.id;

          const process =
            processes.find(
              (item) => item.id === task.procesoId
            ) ?? null;

          return (
            <MatrixRowCard
              key={task.id}
              task={task}
              process={process}
              expanded={expanded}
              canEdit={canEdit}
              isDeactivating={isDeactivating}
              onToggle={() =>
                toggleExpanded(task.id)
              }
              onView={() => onView(task)}
              onEdit={() => onEdit(task)}
              onDeactivate={() =>
                onDeactivate(task)
              }
              onEditCycle={() =>
                onEditCycle(
                  task.aspecto.estandar
                    .categoriaEstandar
                    .cicloPhva
                )
              }
              onEditCategory={() =>
                onEditCategory(
                  task.aspecto.estandar
                    .categoriaEstandar
                )
              }
              onEditStandard={() =>
                onEditStandard(
                  task.aspecto.estandar
                )
              }
              onEditAspect={() =>
                onEditAspect(task.aspecto)
              }
              onEditProcess={() => {
                if (process) {
                  onEditProcess(process);
                }
              }}
            />
          );
        })
      )}
    </section>
  );
}

function MatrixRowCard({
  task,
  process,
  expanded,
  canEdit,
  isDeactivating,
  onToggle,
  onView,
  onEdit,
  onDeactivate,
  onEditCycle,
  onEditCategory,
  onEditStandard,
  onEditAspect,
  onEditProcess,
}: {
  task: MatrixTask;
  process: ProcessCatalog | null;
  expanded: boolean;
  canEdit: boolean;
  isDeactivating: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
  onEditCycle: () => void;
  onEditCategory: () => void;
  onEditStandard: () => void;
  onEditAspect: () => void;
  onEditProcess: () => void;
}) {
  const aspect = task.aspecto;
  const standard = aspect.estandar;
  const category =
    standard.categoriaEstandar;
  const cycle = category.cicloPhva;
  const periodicity =
    getPeriodicity(aspect);
  const ministerialGroups =
    standard.gruposMinisteriales.map(
      (item) =>
        item.grupoMinisterial.nombre
    );

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111] shadow-[0_14px_40px_rgba(0,0,0,0.16)] transition hover:border-neutral-700">
      <header className="flex flex-col gap-3 border-b border-neutral-800/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-neutral-800 bg-[#090909] px-2 font-mono text-xs font-bold text-cyan-300">
            {task.orden}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[11px] text-neutral-500">
                {task.codigo ?? `FILA-${task.id}`}
              </p>
              <StatusBadge
                status={task.estado}
              />
            </div>
            <p className="mt-1 truncate text-xs text-neutral-600">
              {task.versionSupermatriz.nombre}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <IconButton
            label="Ver ficha completa"
            onClick={onView}
          >
            <Eye size={16} />
          </IconButton>
          {canEdit && (
            <>
              <IconButton
                label="Editar fila paso a paso"
                onClick={onEdit}
              >
                <Edit2 size={16} />
              </IconButton>
              <IconButton
                label="Desactivar fila"
                onClick={onDeactivate}
                disabled={isDeactivating}
                danger
              >
                {isDeactivating ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}
              </IconButton>
            </>
          )}
        </div>
      </header>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <PathChip
            label="PHVA"
            value={cycle.nombre}
          />
          <PathSeparator />
          <PathChip
            label="Categoría"
            value={category.nombre}
          />
          <PathSeparator />
          <PathChip
            label="Estándar"
            value={
              standard.codigo
                ? `${standard.codigo} · ${standard.nombre}`
                : standard.nombre
            }
            wide
          />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.35fr_1fr]">
          <ContentCard
            icon={<Workflow size={17} />}
            eyebrow="Proceso"
            title={process?.nombre ?? task.proceso.nombre}
            text={
              process?.descripcion ||
              "Proceso desde el cual se trabaja esta actividad."
            }
            accent="violet"
          />

          <ContentCard
            icon={<ClipboardCheck size={17} />}
            eyebrow="Aspecto evaluable"
            title={
              aspect.codigo
                ? `${aspect.codigo} · ${aspect.nombre}`
                : aspect.nombre
            }
            text={
              aspect.planAccionEspecifico
                ?.descripcion ||
              "Este aspecto todavía no tiene plan de acción específico."
            }
            accent="amber"
            textLabel="Plan de acción"
          />

          <ContentCard
            icon={<Route size={17} />}
            eyebrow="Cómo se ejecuta"
            title={
              task.responsableActividad ||
              "Responsable por definir"
            }
            text={
              task.ejecucion ||
              "La ejecución todavía no ha sido descrita."
            }
            accent="cyan"
            textLabel="Ejecución"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-800/70 pt-4">
          {task.categoriasGestion.map(
            (relation) => (
              <InfoPill
                key={
                  relation.categoriaGestionId
                }
                text={
                  relation.categoriaGestion
                    .nombre
                }
              />
            )
          )}

          {ministerialGroups.map((group) => (
            <InfoPill
              key={group}
              text={group}
              variant="violet"
            />
          ))}

          <InfoPill
            text={periodicity}
            variant="neutral"
            icon={
              <CalendarClock size={12} />
            }
          />

          {aspect.configuracion
            ?.esEvergreen && (
            <InfoPill
              text="Evergreen"
              variant="emerald"
              icon={
                <ShieldCheck size={12} />
              }
            />
          )}
        </div>
      </div>

      <div className="border-t border-neutral-800/70 bg-[#0b0b0b]">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs text-neutral-500 transition hover:bg-neutral-800/30 hover:text-neutral-300 sm:px-5"
        >
          <span>
            {expanded
              ? "Ocultar herramientas y detalles"
              : "Ver detalles y editar elementos conectados"}
          </span>
          {expanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expanded && (
          <div className="grid gap-4 border-t border-neutral-800/70 p-4 sm:p-5 xl:grid-cols-[1fr_1.25fr]">
            <section className="rounded-xl border border-neutral-800 bg-[#090909] p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Settings2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Estructura conectada
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-neutral-600">
                    Cada botón abre únicamente el elemento seleccionado, sin perder la fila.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <EditConnectedButton
                  label="Ciclo PHVA"
                  value={cycle.nombre}
                  onClick={onEditCycle}
                  disabled={!canEdit}
                />
                <EditConnectedButton
                  label="Categoría"
                  value={category.nombre}
                  onClick={onEditCategory}
                  disabled={!canEdit}
                />
                <EditConnectedButton
                  label="Estándar"
                  value={standard.nombre}
                  onClick={onEditStandard}
                  disabled={!canEdit}
                />
                <EditConnectedButton
                  label="Aspecto y plan"
                  value={aspect.nombre}
                  onClick={onEditAspect}
                  disabled={!canEdit}
                />
                <EditConnectedButton
                  label="Proceso"
                  value={process?.nombre ?? task.proceso.nombre}
                  onClick={onEditProcess}
                  disabled={!canEdit || !process}
                />
                <EditConnectedButton
                  label="Fila operativa"
                  value="Ejecución, gestión y recursos"
                  onClick={onEdit}
                  disabled={!canEdit}
                />
              </div>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-[#090909] p-4">
              <h4 className="text-sm font-semibold text-white">
                Resumen operativo
              </h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailValue
                  label="Fundamentos y soportes"
                  value={task.fundamentosSoportes}
                />
                <DetailValue
                  label="Meta esperada"
                  value={task.metasEstandar}
                />
                <DetailValue
                  label="Recursos administrativos"
                  value={task.recursosAdministrativos}
                />
                <DetailValue
                  label="Revisión técnica"
                  value={
                    aspect.configuracionRevision
                      ?.requiereRevisionTecnica
                      ? "Sí requiere validación técnica"
                      : "No requiere validación técnica"
                  }
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </article>
  );
}

function PathChip({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border border-neutral-800 bg-[#090909] px-3 py-2 ${
        wide ? "max-w-full sm:max-w-xl" : ""
      }`}
    >
      <span className="mr-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </span>
      <span className="text-xs font-medium text-neutral-300">
        {value}
      </span>
    </div>
  );
}

function PathSeparator() {
  return (
    <span className="hidden text-neutral-700 sm:inline">
      / 
    </span>
  );
}

function ContentCard({
  icon,
  eyebrow,
  title,
  text,
  accent,
  textLabel,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  accent: "cyan" | "amber" | "violet";
  textLabel?: string;
}) {
  const styles = {
    cyan: {
      border: "border-cyan-500/15",
      background: "bg-cyan-500/[0.045]",
      icon: "bg-cyan-500/10 text-cyan-400",
    },
    amber: {
      border: "border-amber-500/15",
      background: "bg-amber-500/[0.045]",
      icon: "bg-amber-500/10 text-amber-300",
    },
    violet: {
      border: "border-violet-500/15",
      background: "bg-violet-500/[0.045]",
      icon: "bg-violet-500/10 text-violet-300",
    },
  }[accent];

  return (
    <section
      className={`min-w-0 rounded-xl border p-4 ${styles.border} ${styles.background}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
        >
          {icon}
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-6 text-white">
        {title}
      </h3>

      {textLabel && (
        <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
          {textLabel}
        </p>
      )}
      <p className={`${textLabel ? "mt-1" : "mt-2"} line-clamp-4 text-xs leading-5 text-neutral-400`}>
        {text}
      </p>
    </section>
  );
}

function InfoPill({
  text,
  variant = "cyan",
  icon,
}: {
  text: string;
  variant?:
    | "cyan"
    | "violet"
    | "neutral"
    | "emerald";
  icon?: ReactNode;
}) {
  const style = {
    cyan:
      "border-cyan-500/15 bg-cyan-500/5 text-cyan-300",
    violet:
      "border-violet-500/15 bg-violet-500/5 text-violet-300",
    neutral:
      "border-neutral-800 bg-[#090909] text-neutral-400",
    emerald:
      "border-emerald-500/15 bg-emerald-500/5 text-emerald-300",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${style}`}
    >
      {icon}
      {text}
    </span>
  );
}

function IconButton({
  label,
  children,
  onClick,
  disabled = false,
  danger = false,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-wait disabled:opacity-50 ${
        danger
          ? "border-red-500/15 text-red-400 hover:bg-red-500/10"
          : "border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function EditConnectedButton({
  label,
  value,
  onClick,
  disabled,
}: {
  label: string;
  value: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 text-left transition hover:border-cyan-500/20 hover:bg-cyan-500/5 disabled:cursor-default disabled:hover:border-neutral-800 disabled:hover:bg-[#0d0d0d]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
          {label}
        </span>
        {!disabled && (
          <Edit2 className="h-3.5 w-3.5 text-neutral-700 transition group-hover:text-cyan-400" />
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-300">
        {value}
      </p>
    </button>
  );
}

function DetailValue({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-2 line-clamp-4 text-xs leading-5 text-neutral-400">
        {value || "Sin información registrada."}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800/70 bg-[#111111] text-xs text-neutral-500">
      <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
      Cargando filas de la Supermatriz…
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-800 bg-[#0d0d0d] px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-[#090909] text-neutral-600">
        <FileText size={20} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-white">
        No hay filas para mostrar
      </h3>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-neutral-600">
        Cambia los filtros o utiliza “Construir nueva fila” para crear la ruta completa paso a paso.
      </p>
    </div>
  );
}

function getPeriodicity(
  aspect: AspectCatalog
): string {
  const validity =
    aspect.configuracionVigencia;

  if (
    !validity?.cantidad ||
    !validity.unidad
  ) {
    return "Revisión anual";
  }

  const unit = {
    DIA: "día(s)",
    SEMANA: "semana(s)",
    MES: "mes(es)",
    ANIO: "año(s)",
  }[validity.unidad];

  return `Cada ${validity.cantidad} ${unit}`;
}
