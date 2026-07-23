import type {
  CSSProperties,
  ReactNode,
} from "react";
import {
  Edit2,
  Eye,
  Loader2,
  PencilLine,
  Trash2,
} from "lucide-react";

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
  loading: boolean;
  canEdit: boolean;
  deactivatingTaskId?: number | null;
  onView: (task: MatrixTask) => void;
  onEditTask: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
  onEditCycle: (cycle: PhvaCycle) => void;
  onEditCategory: (category: StandardCategory) => void;
  onEditStandard: (standard: Standard) => void;
  onEditAspect: (aspect: AspectCatalog) => void;
  onEditProcess: (process: ProcessCatalog) => void;
}

const columns = [
  { number: "1", label: "Orden", width: 72 },
  { number: "2", label: "Proceso", width: 220 },
  { number: "3", label: "Aspecto", width: 360 },
  {
    number: "4",
    label: "Plan de acción específico",
    width: 360,
  },
  {
    number: "5",
    label: "Informe estado tareas",
    width: 120,
  },
  { number: "6", label: "Ciclo PHVA", width: 170 },
  {
    number: "7",
    label: "% esperado ciclo",
    width: 105,
  },
  {
    number: "8",
    label: "Categoría del estándar",
    width: 230,
  },
  {
    number: "9",
    label: "% esperado categoría",
    width: 115,
  },
  { number: "10", label: "Estándar", width: 320 },
  {
    number: "11",
    label: "Calif. esperada",
    width: 115,
  },
  {
    number: "12",
    label: "Gestión intervención",
    width: 135,
  },
  {
    number: "13",
    label: "Gestión documental",
    width: 135,
  },
  {
    number: "14",
    label: "Gestión emergencias",
    width: 135,
  },
  {
    number: "15",
    label: "Documentos evergreen",
    width: 160,
  },
  { number: "16", label: "Ejecución", width: 310 },
  {
    number: "17",
    label: "Doc. actual periódica",
    width: 160,
  },
  { number: "18", label: "7 estándares", width: 105 },
  { number: "19", label: "21 estándares", width: 110 },
  { number: "20", label: "60 estándares", width: 110 },
  {
    number: "21",
    label: "Responsable de la actividad",
    width: 230,
  },
  {
    number: "22",
    label: "Fundamentos y soportes",
    width: 330,
  },
  {
    number: "23",
    label: "Metas del estándar",
    width: 300,
  },
  {
    number: "24",
    label: "Recursos administrativos",
    width: 290,
  },
] as const;

const TABLE_WIDTH =
  columns.reduce((total, column) => total + column.width, 0) + 132;

const baseCell =
  "border-b border-r border-neutral-300/80 px-3 py-3 align-top text-xs leading-5";

export default function SupermatrizTable({
  tasks,
  loading,
  canEdit,
  deactivatingTaskId = null,
  onView,
  onEditTask,
  onDeactivate,
  onEditCycle,
  onEditCategory,
  onEditStandard,
  onEditAspect,
  onEditProcess,
}: Props) {
  const initialLoading = loading && tasks.length === 0;
  const refreshing = loading && tasks.length > 0;

  return (
    <section
      aria-busy={loading}
      className="relative overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111] shadow-2xl"
    >
      <div className="flex flex-col gap-2 border-b border-neutral-800 bg-[#090909] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-neutral-500">
          <strong className="text-neutral-300">
            Edición rápida:
          </strong>{" "}
          pulsa una celda de color para editar el catálogo conectado. El lápiz modifica la fila completa.
        </p>
        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wider">
          <Legend className="bg-[#0d3b43] text-white" label="Proceso" />
          <Legend className="bg-[#ffd96a] text-slate-950" label="Aspecto" />
          <Legend className="bg-[#dbeafe] text-blue-800" label="Estructura" />
          <Legend className="bg-white text-slate-900" label="Operación" />
        </div>
      </div>

      {refreshing && (
        <div className="absolute inset-x-0 top-[57px] z-40 flex items-center justify-center gap-2 border-b border-cyan-500/20 bg-[#071013]/95 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin" />
          Actualizando la matriz…
        </div>
      )}

      <div className="hidden max-h-[72vh] overflow-auto md:block">
        <table
          className="table-fixed border-collapse text-left"
          style={{ minWidth: TABLE_WIDTH }}
        >
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.number}
                style={{ width: column.width }}
              />
            ))}
            <col style={{ width: 132 }} />
          </colgroup>

          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.number}
                  style={stickyColumnStyle(index)}
                  className={`${numericHeaderClass(index)} h-7 min-w-0 border-b border-r border-neutral-400/80 px-2 text-center text-[10px] font-bold text-slate-700`}
                >
                  {column.number}
                </th>
              ))}
              <th className="sticky right-0 top-0 z-50 h-7 border-b border-l border-r border-neutral-700 bg-neutral-200 px-2 text-center text-[10px] font-bold text-slate-700">
                —
              </th>
            </tr>

            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.label}
                  style={stickyColumnStyle(index)}
                  className={`${labelHeaderClass(index)} min-w-0 border-b-2 border-r border-neutral-700 px-3 py-3 text-center text-[11px] font-extrabold uppercase leading-4 tracking-tight`}
                >
                  {column.label}
                </th>
              ))}
              <th className="sticky right-0 top-7 z-50 border-b-2 border-l border-r border-neutral-700 bg-[#101010] px-3 py-3 text-center text-[11px] font-extrabold uppercase text-neutral-300">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {initialLoading ? (
              <tr>
                <td
                  colSpan={25}
                  className="bg-[#111111] px-6 py-20 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-neutral-500">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    <span className="text-sm">
                      Cargando la Supermatriz…
                    </span>
                  </div>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={25}
                  className="bg-[#111111] px-6 py-20 text-center text-sm text-neutral-500"
                >
                  No se encontraron filas con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <MatrixRow
                  key={task.id}
                  task={task}
                  canEdit={canEdit}
                  isDeactivating={
                    deactivatingTaskId === task.id
                  }
                  onView={onView}
                  onEditTask={onEditTask}
                  onDeactivate={onDeactivate}
                  onEditCycle={onEditCycle}
                  onEditCategory={onEditCategory}
                  onEditStandard={onEditStandard}
                  onEditAspect={onEditAspect}
                  onEditProcess={onEditProcess}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-neutral-800 md:hidden">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-xs text-neutral-500">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            Cargando filas…
          </div>
        ) : tasks.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-neutral-500">
            No se encontraron filas.
          </div>
        ) : (
          tasks.map((task) => (
            <MobileRow
              key={task.id}
              task={task}
              canEdit={canEdit}
              isDeactivating={
                deactivatingTaskId === task.id
              }
              onView={onView}
              onEdit={onEditTask}
              onDeactivate={onDeactivate}
            />
          ))
        )}
      </div>
    </section>
  );
}

function MatrixRow({
  task,
  canEdit,
  isDeactivating,
  onView,
  onEditTask,
  onDeactivate,
  onEditCycle,
  onEditCategory,
  onEditStandard,
  onEditAspect,
  onEditProcess,
}: {
  task: MatrixTask;
  canEdit: boolean;
  isDeactivating: boolean;
  onView: (task: MatrixTask) => void;
  onEditTask: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
  onEditCycle: (cycle: PhvaCycle) => void;
  onEditCategory: (category: StandardCategory) => void;
  onEditStandard: (standard: Standard) => void;
  onEditAspect: (aspect: AspectCatalog) => void;
  onEditProcess: (process: ProcessCatalog) => void;
}) {
  const aspect = task.aspecto;
  const standard = aspect.estandar;
  const category = standard.categoriaEstandar;
  const cycle = category.cicloPhva;
  const config = aspect.configuracion;

  return (
    <tr className="group min-h-24 bg-white text-slate-900 transition-colors hover:brightness-[0.985]">
      <td
        style={{ left: 0 }}
        className={`${baseCell} sticky z-20 w-[72px] bg-white text-center font-bold text-red-600 group-hover:bg-slate-50`}
      >
        <button
          type="button"
          onClick={() => onView(task)}
          className="w-full rounded-md px-1 py-1 hover:bg-cyan-50 hover:text-cyan-700"
          title="Abrir detalle de la fila"
        >
          {task.orden}
        </button>
      </td>

      <td
        style={{ left: 72 }}
        className={`${baseCell} sticky z-20 w-[220px] bg-[#0d3b43] font-semibold text-white group-hover:bg-[#104650]`}
      >
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditProcess(task.proceso)}
          title="Editar proceso"
        >
          {task.proceso.codigo && (
            <span className="mb-1 block text-[10px] font-bold uppercase text-cyan-200/70">
              {task.proceso.codigo}
            </span>
          )}
          {task.proceso.nombre}
        </EditableCell>
      </td>

      <td
        style={{ left: 292 }}
        className={`${baseCell} sticky z-20 w-[360px] bg-[#ffd96a] font-semibold text-slate-950 group-hover:bg-[#ffdc76]`}
      >
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditAspect(aspect)}
          title="Editar aspecto y sus reglas"
        >
          <span className="font-extrabold">
            {aspect.codigo
              ? `${aspect.codigo}. `
              : ""}
          </span>
          {aspect.nombre}
        </EditableCell>
      </td>

      <td className={`${baseCell} w-[360px] bg-white text-blue-700`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditAspect(aspect)}
          title="Editar el plan de acción del aspecto"
        >
          {aspect.planAccionEspecifico?.descripcion ?? (
            <EmptyCell text="Sin plan de acción" />
          )}
        </EditableCell>
      </td>

      <BooleanCell
        value={Boolean(
          config?.incluirInformeEstadoTareas
        )}
      />

      <td className={`${baseCell} w-[170px] bg-white text-center font-extrabold text-red-600`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditCycle(cycle)}
          title="Editar ciclo PHVA"
          center
        >
          {cycle.nombre}
        </EditableCell>
      </td>

      <NumberCell value={cycle.porcentajeEsperado} />

      <td className={`${baseCell} w-[230px] bg-[#dbeafe] text-center font-bold text-blue-700`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditCategory(category)}
          title="Editar categoría del estándar"
          center
        >
          {category.nombre}
        </EditableCell>
      </td>

      <NumberCell value={category.porcentajeEsperado} />

      <td className={`${baseCell} w-[320px] bg-white font-bold text-blue-700`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditStandard(standard)}
          title="Editar estándar y grupos 7/21/60"
        >
          {standard.codigo
            ? `${standard.codigo}. `
            : ""}
          {standard.nombre}
        </EditableCell>
      </td>

      <NumberCell
        value={
          standard.calificacionMinisterialEsperada
        }
        bold
      />

      <MarkCell
        value={hasManagement(task, "INTERVENCION")}
      />
      <MarkCell
        value={hasManagement(task, "DOCUMENTAL")}
      />
      <MarkCell
        value={hasManagement(task, "EMERGENCIAS")}
      />

      <td className={`${baseCell} w-[160px] bg-white text-center font-bold text-blue-700`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditAspect(aspect)}
          title="Editar configuración evergreen"
          center
        >
          {evergreenLabel(aspect) || "—"}
        </EditableCell>
      </td>

      <td className={`${baseCell} w-[310px] bg-white text-slate-900`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditTask(task)}
          title="Editar ejecución de la fila"
        >
          {task.ejecucion ?? (
            <EmptyCell text="Sin explicación de ejecución" />
          )}
        </EditableCell>
      </td>

      <td className={`${baseCell} w-[160px] bg-white text-center font-bold text-emerald-700`}>
        <EditableCell
          enabled={canEdit}
          onClick={() => onEditAspect(aspect)}
          title="Editar periodicidad y vigencia"
          center
        >
          {periodicityLabel(aspect)}
        </EditableCell>
      </td>

      <GroupCell
        value={hasMinisterialGroup(
          task,
          "ESTANDARES_7"
        )}
      />
      <GroupCell
        value={hasMinisterialGroup(
          task,
          "ESTANDARES_21"
        )}
      />
      <GroupCell
        value={hasMinisterialGroup(
          task,
          "ESTANDARES_60"
        )}
      />

      <OperationalCell
        text={task.responsableActividad}
        onClick={() => onEditTask(task)}
        enabled={canEdit}
        accent="red"
      />
      <OperationalCell
        text={task.fundamentosSoportes}
        onClick={() => onEditTask(task)}
        enabled={canEdit}
      />
      <OperationalCell
        text={task.metasEstandar}
        onClick={() => onEditTask(task)}
        enabled={canEdit}
        accent="red"
      />
      <OperationalCell
        text={task.recursosAdministrativos}
        onClick={() => onEditTask(task)}
        enabled={canEdit}
      />

      <td className="sticky right-0 z-30 border-b border-l border-r border-neutral-700 bg-[#101010] px-2 py-3 align-top">
        <div className="flex min-w-[112px] items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(task)}
            className="rounded-lg p-2 text-cyan-400 hover:bg-cyan-500/10"
            title="Ver ficha completa"
          >
            <Eye size={16} />
          </button>

          {canEdit && (
            <>
              <button
                type="button"
                onClick={() => onEditTask(task)}
                disabled={isDeactivating}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-40"
                title="Editar fila"
              >
                <Edit2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDeactivate(task)}
                disabled={isDeactivating}
                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-50"
                title="Desactivar fila"
              >
                {isDeactivating ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </>
          )}
        </div>
        <div className="mt-2 flex justify-end">
          <StatusBadge status={task.estado} />
        </div>
      </td>
    </tr>
  );
}

function EditableCell({
  enabled,
  onClick,
  title,
  children,
  center = false,
}: {
  enabled: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
  center?: boolean;
}) {
  if (!enabled) {
    return (
      <div className={center ? "text-center" : ""}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`group/edit relative block w-full rounded-md p-1 text-left outline-none ring-cyan-500/30 hover:bg-black/5 focus:ring-2 ${
        center ? "text-center" : ""
      }`}
    >
      {children}
      <PencilLine className="absolute right-1 top-1 h-3.5 w-3.5 opacity-0 transition-opacity group-hover/edit:opacity-50" />
    </button>
  );
}

function NumberCell({
  value,
  bold = false,
}: {
  value: string | number | null;
  bold?: boolean;
}) {
  return (
    <td
      className={`${baseCell} bg-white text-center ${
        bold ? "font-extrabold" : "font-semibold"
      } text-slate-900`}
    >
      {formatNumber(value)}
    </td>
  );
}

function BooleanCell({ value }: { value: boolean }) {
  return (
    <td className={`${baseCell} bg-white text-center font-extrabold text-slate-900`}>
      {value ? "X" : ""}
    </td>
  );
}

function MarkCell({ value }: { value: boolean }) {
  return (
    <td className={`${baseCell} bg-white text-center text-lg font-black text-blue-700`}>
      {value ? "X" : ""}
    </td>
  );
}

function GroupCell({ value }: { value: boolean }) {
  return (
    <td className={`${baseCell} bg-white text-center text-sm font-black text-slate-900`}>
      {value ? "1" : ""}
    </td>
  );
}

function OperationalCell({
  text,
  onClick,
  enabled,
  accent,
}: {
  text: string | null;
  onClick: () => void;
  enabled: boolean;
  accent?: "red";
}) {
  return (
    <td
      className={`${baseCell} bg-white ${
        accent === "red"
          ? "font-semibold text-red-600"
          : "text-slate-900"
      }`}
    >
      <EditableCell
        enabled={enabled}
        onClick={onClick}
        title="Editar información operativa de la fila"
      >
        {text ?? <EmptyCell text="Sin definir" />}
      </EditableCell>
    </td>
  );
}

function EmptyCell({ text }: { text: string }) {
  return (
    <span className="font-normal italic text-slate-400">
      {text}
    </span>
  );
}

function MobileRow({
  task,
  canEdit,
  isDeactivating,
  onView,
  onEdit,
  onDeactivate,
}: {
  task: MatrixTask;
  canEdit: boolean;
  isDeactivating: boolean;
  onView: (task: MatrixTask) => void;
  onEdit: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
}) {
  return (
    <article className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-cyan-400">
            Orden {task.orden} · {task.codigo ?? `#${task.id}`}
          </p>
          <h3 className="mt-1 text-sm font-semibold leading-6 text-white">
            {task.aspecto.nombre}
          </h3>
        </div>
        <StatusBadge status={task.estado} />
      </div>

      <div className="grid gap-2">
        <MobileInfo
          label="Proceso"
          value={task.proceso.nombre}
          dark
        />
        <MobileInfo
          label="Estándar"
          value={task.aspecto.estandar.nombre}
        />
        <MobileInfo
          label="Plan de acción"
          value={
            task.aspecto.planAccionEspecifico
              ?.descripcion ?? "Sin plan"
          }
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(task)}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300"
        >
          <Eye size={15} />
          Ver detalle
        </button>
        {canEdit && (
          <>
            <button
              type="button"
              onClick={() => onEdit(task)}
              disabled={isDeactivating}
              className="flex items-center gap-2 rounded-xl border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-300 disabled:opacity-40"
            >
              <Edit2 size={14} />
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDeactivate(task)}
              disabled={isDeactivating}
              className="rounded-xl border border-red-500/20 px-4 py-2 text-xs font-medium text-red-400 disabled:opacity-40"
            >
              {isDeactivating ? "Desactivando…" : "Desactivar"}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function MobileInfo({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        dark
          ? "border-cyan-500/20 bg-[#0d3b43]"
          : "border-neutral-800 bg-[#090909]"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-neutral-200">
        {value}
      </p>
    </div>
  );
}

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className={`rounded-md px-2 py-1 ${className}`}>
      {label}
    </span>
  );
}

function stickyColumnStyle(index: number): CSSProperties | undefined {
  if (index === 0) return { left: 0 };
  if (index === 1) return { left: 72 };
  if (index === 2) return { left: 292 };
  return undefined;
}

function numericHeaderClass(index: number): string {
  const sticky = index <= 2 ? "sticky z-40" : "sticky z-30";
  return `${sticky} top-0 bg-neutral-200`;
}

function labelHeaderClass(index: number): string {
  const sticky = index <= 2 ? "sticky z-40" : "sticky z-30";
  const palette =
    index === 0
      ? "bg-white text-red-600"
      : index === 1
        ? "bg-[#9dbce9] text-slate-950"
        : index === 2
          ? "bg-[#9dbce9] text-slate-950"
          : index === 3
            ? "bg-[#9dbce9] text-slate-950"
            : "bg-[#9dbce9] text-slate-950";

  return `${sticky} top-7 ${palette}`;
}

function formatNumber(
  value: string | number | null
): string {
  if (value === null || value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(numeric);
}

function hasManagement(
  task: MatrixTask,
  code: "INTERVENCION" | "DOCUMENTAL" | "EMERGENCIAS"
): boolean {
  return task.categoriasGestion.some(
    (item) => item.categoriaGestion.codigo === code
  );
}

function hasMinisterialGroup(
  task: MatrixTask,
  code:
    | "ESTANDARES_7"
    | "ESTANDARES_21"
    | "ESTANDARES_60"
): boolean {
  return task.aspecto.estandar.gruposMinisteriales.some(
    (item) => item.grupoMinisterial.codigo === code
  );
}

function evergreenLabel(aspect: AspectCatalog): string {
  if (!aspect.configuracion?.esEvergreen) return "";

  const labels = {
    PRIMER_CUATRIMESTRE: "Bloque 1",
    SEGUNDO_CUATRIMESTRE: "Bloque 2",
    TERCER_CUATRIMESTRE: "Bloque 3",
  } as const;

  return aspect.configuracion.bloqueEvergreen
    ? labels[aspect.configuracion.bloqueEvergreen]
    : "Evergreen";
}

function periodicityLabel(aspect: AspectCatalog): string {
  const validity = aspect.configuracionVigencia;

  if (!validity?.cantidad || !validity.unidad) {
    return "Anual";
  }

  const unitLabels = {
    DIA: validity.cantidad === 1 ? "día" : "días",
    SEMANA:
      validity.cantidad === 1 ? "semana" : "semanas",
    MES: validity.cantidad === 1 ? "mes" : "meses",
    ANIO: validity.cantidad === 1 ? "año" : "años",
  } as const;

  if (
    validity.cantidad === 12 &&
    validity.unidad === "MES"
  ) {
    return "Anual";
  }

  return `Cada ${validity.cantidad} ${unitLabels[validity.unidad]}`;
}
