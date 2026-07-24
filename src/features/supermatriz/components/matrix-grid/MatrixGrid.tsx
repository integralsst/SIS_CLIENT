import {
  Edit2,
  Eye,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type {
  AspectCatalog,
  MatrixCatalogs,
  MatrixTask,
  MatrixTaskPayload,
  PhvaCycle,
  ProcessCatalog,
  Standard,
  StandardCategory,
} from "../../types/supermatriz.types";

import MatrixCellMenu from "./MatrixCellMenu";
import MatrixColumnPicker from "./MatrixColumnPicker";
import MatrixMultiSelectEditor from "./MatrixMultiSelectEditor";
import MatrixSelectEditor from "./MatrixSelectEditor";
import MatrixTextEditor from "./MatrixTextEditor";
import type {
  MatrixColumnDefinition,
  MatrixColumnKey,
} from "./matrixGrid.types";
import {
  DEFAULT_VISIBLE_COLUMNS,
  MATRIX_COLUMNS,
  columnTotalWidth,
  formatDailyTask,
  formatPeriodicity,
  taskToPayload,
  textOrDash,
} from "./matrixGrid.utils";

const STORAGE_KEY = "stack44_matrix_visible_columns_v2";

interface Props {
  tasks: MatrixTask[];
  catalogs: MatrixCatalogs;
  loading: boolean;
  canEdit: boolean;
  deactivatingTaskId?: number | null;
  onView: (task: MatrixTask) => void;
  onEdit: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
  onEditCycle: (cycle: PhvaCycle) => void;
  onEditCategory: (category: StandardCategory) => void;
  onEditStandard: (standard: Standard) => void;
  onEditAspect: (aspect: AspectCatalog) => void;
  onEditProcess: (process: ProcessCatalog) => void;
  onSaveTask: (
    current: MatrixTask,
    payload: MatrixTaskPayload
  ) => Promise<unknown>;
}

export default function MatrixGrid({
  tasks,
  catalogs,
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
  onSaveTask,
}: Props) {
  const [visibleColumns, setVisibleColumns] = useState<MatrixColumnKey[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_VISIBLE_COLUMNS;
      const parsed = JSON.parse(stored) as MatrixColumnKey[];
      const valid = parsed.filter((key) =>
        MATRIX_COLUMNS.some((column) => column.key === key)
      );
      return valid.length > 0 ? valid : DEFAULT_VISIBLE_COLUMNS;
    } catch {
      return DEFAULT_VISIBLE_COLUMNS;
    }
  });

  const columns = useMemo(
    () => MATRIX_COLUMNS.filter((column) => visibleColumns.includes(column.key)),
    [visibleColumns]
  );

  function changeColumns(next: MatrixColumnKey[]) {
    setVisibleColumns(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const initialLoading = loading && tasks.length === 0;
  const refreshing = loading && tasks.length > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-[#0d0d0d]">
      <div className="flex flex-col gap-3 border-b border-neutral-800/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Vista completa</p>
          <p className="mt-0.5 text-xs text-neutral-600">
            Desplázate horizontalmente. Las celdas con flecha se pueden editar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {refreshing && (
            <span className="flex items-center gap-2 text-xs text-cyan-300">
              <Loader2 size={14} className="animate-spin" />
              Actualizando
            </span>
          )}
          <MatrixColumnPicker visible={visibleColumns} onChange={changeColumns} />
        </div>
      </div>

      {initialLoading ? (
        <div className="flex min-h-72 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="px-6 py-20 text-center text-sm text-neutral-500">
          No hay filas para los filtros seleccionados.
        </div>
      ) : (
        <div className="max-h-[calc(100dvh-260px)] min-h-[420px] overflow-auto overscroll-contain">
          <table
            className="border-separate border-spacing-0 text-left text-xs"
            style={{ minWidth: columnTotalWidth(visibleColumns) }}
          >
            <colgroup>
              {columns.map((column) => (
                <col key={column.key} style={{ width: column.width }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-40">
              <tr>
                {columns.map((column) => (
                  <MatrixHeaderCell key={column.key} column={column} />
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <MatrixRow
                  key={task.id}
                  task={task}
                  columns={columns}
                  catalogs={catalogs}
                  canEdit={canEdit}
                  isDeactivating={deactivatingTaskId === task.id}
                  onView={() => onView(task)}
                  onEdit={() => onEdit(task)}
                  onDeactivate={() => onDeactivate(task)}
                  onEditCycle={onEditCycle}
                  onEditCategory={onEditCategory}
                  onEditStandard={onEditStandard}
                  onEditAspect={onEditAspect}
                  onEditProcess={onEditProcess}
                  onSaveTask={(payload) => onSaveTask(task, payload)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function MatrixHeaderCell({ column }: { column: MatrixColumnDefinition }) {
  const sticky = column.stickyLeft !== undefined;
  const style: CSSProperties = {
    width: column.width,
    minWidth: column.width,
    maxWidth: column.width,
    ...(sticky ? { left: column.stickyLeft } : {}),
  };

  return (
    <th
      style={style}
      className={`border-b border-r border-neutral-700 bg-[#191919] px-3 py-3 align-bottom text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-300 ${
        sticky ? "sticky z-50 shadow-[8px_0_18px_rgba(0,0,0,.18)]" : ""
      }`}
    >
      {column.label}
    </th>
  );
}

function MatrixRow({
  task,
  columns,
  catalogs,
  canEdit,
  isDeactivating,
  onView,
  onEdit,
  onDeactivate,
  onEditCycle,
  onEditCategory,
  onEditStandard,
  onEditAspect,
  onEditProcess,
  onSaveTask,
}: {
  task: MatrixTask;
  columns: MatrixColumnDefinition[];
  catalogs: MatrixCatalogs;
  canEdit: boolean;
  isDeactivating: boolean;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
  onEditCycle: (cycle: PhvaCycle) => void;
  onEditCategory: (category: StandardCategory) => void;
  onEditStandard: (standard: Standard) => void;
  onEditAspect: (aspect: AspectCatalog) => void;
  onEditProcess: (process: ProcessCatalog) => void;
  onSaveTask: (payload: MatrixTaskPayload) => Promise<unknown>;
}) {
  const aspect = task.aspecto;
  const standard = aspect.estandar;
  const category = standard.categoriaEstandar;
  const cycle = category.cicloPhva;
  const fullProcess = catalogs.procesos.find((item) => item.id === task.procesoId) ?? task.proceso;

  async function patch(patchValue: Partial<MatrixTaskPayload>) {
    await onSaveTask({
      ...taskToPayload(task),
      ...patchValue,
    });
  }

  return (
    <tr className="group align-top hover:bg-white/[0.018]">
      {columns.map((column) => (
        <MatrixBodyCell key={column.key} column={column}>
          {renderCell(column.key)}
        </MatrixBodyCell>
      ))}
    </tr>
  );

  function renderCell(key: MatrixColumnKey): ReactNode {
    switch (key) {
      case "orden":
        return (
          <MatrixTextEditor
            value={String(task.orden)}
            title="Orden de la fila"
            canEdit={canEdit}
            multiline={false}
            numeric
            onSave={(value) => patch({ orden: Number(value) })}
          />
        );
      case "codigo":
        return (
          <MatrixTextEditor
            value={task.codigo}
            title="Código de la fila"
            canEdit={canEdit}
            multiline={false}
            onSave={(value) => patch({ codigo: value.trim() || null })}
          />
        );
      case "proceso":
        return (
          <MatrixSelectEditor
            value={task.procesoId}
            display={task.proceso.codigo ? `${task.proceso.codigo}. ${task.proceso.nombre}` : task.proceso.nombre}
            title="Proceso de la fila"
            canEdit={canEdit}
            toneClassName="font-semibold text-cyan-100"
            options={catalogs.procesos
              .filter((item) => item.estado === "ACTIVO")
              .map((item) => ({
                value: item.id,
                label: item.codigo ? `${item.codigo} · ${item.nombre}` : item.nombre,
              }))}
            onSave={(value) => patch({ procesoId: Number(value) })}
            onEditCurrent={() => onEditProcess(fullProcess)}
          />
        );
      case "aspecto":
        return (
          <MatrixSelectEditor
            value={task.aspectoId}
            display={aspect.codigo ? `${aspect.codigo}. ${aspect.nombre}` : aspect.nombre}
            title="Aspecto de la fila"
            canEdit={canEdit}
            toneClassName="font-semibold text-amber-100"
            options={catalogs.aspectos
              .filter((item) => item.estado === "ACTIVO")
              .map((item) => ({
                value: item.id,
                label: `${item.estandar.codigo ? `${item.estandar.codigo} · ` : ""}${item.nombre}`,
              }))}
            onSave={(value) => patch({ aspectoId: Number(value) })}
            onEditCurrent={() => onEditAspect(aspect)}
          />
        );
      case "planAccion":
        return (
          <SharedEntityCell
            value={textOrDash(aspect.planAccionEspecifico?.descripcion)}
            title="Plan de acción específico"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "informeTareas":
        return (
          <SharedEntityCell
            value={aspect.configuracion?.incluirInformeEstadoTareas ? "Sí" : "No"}
            title="Informe de estado de tareas"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "ciclo":
        return (
          <SharedEntityCell
            value={cycle.codigo ? `${cycle.codigo} · ${cycle.nombre}` : cycle.nombre}
            title="Ciclo PHVA"
            canEdit={canEdit}
            onEdit={() => onEditCycle(cycle)}
          />
        );
      case "porcentajeCiclo":
        return <PlainValue value={cycle.porcentajeEsperado === null ? "—" : `${cycle.porcentajeEsperado}%`} />;
      case "categoria":
        return (
          <SharedEntityCell
            value={category.codigo ? `${category.codigo} · ${category.nombre}` : category.nombre}
            title="Categoría del estándar"
            canEdit={canEdit}
            onEdit={() => onEditCategory(category)}
          />
        );
      case "porcentajeCategoria":
        return <PlainValue value={category.porcentajeEsperado === null ? "—" : `${category.porcentajeEsperado}%`} />;
      case "estandar":
        return (
          <SharedEntityCell
            value={standard.codigo ? `${standard.codigo}. ${standard.nombre}` : standard.nombre}
            title="Estándar"
            canEdit={canEdit}
            onEdit={() => onEditStandard(standard)}
          />
        );
      case "calificacionMinisterial":
        return <PlainValue value={standard.calificacionMinisterialEsperada === null ? "—" : String(standard.calificacionMinisterialEsperada)} />;
      case "gestion":
        return (
          <MatrixMultiSelectEditor
            selectedIds={task.categoriasGestion.map((item) => item.categoriaGestionId)}
            categories={catalogs.categoriasGestion.filter((item) => item.estado === "ACTIVO")}
            canEdit={canEdit}
            onSave={(ids) => patch({ categoriaGestionIds: ids })}
          />
        );
      case "ejecucion":
        return (
          <MatrixTextEditor
            value={task.ejecucion}
            title="Ejecución"
            canEdit={canEdit}
            onSave={(value) => patch({ ejecucion: value.trim() || null })}
          />
        );
      case "documentoPeriodico":
        return (
          <SharedEntityCell
            value={aspect.configuracion?.documentoActualizacionPeriodica ? "Sí" : "No"}
            title="Documento actual periódico"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "periodicidad":
        return (
          <SharedEntityCell
            value={formatPeriodicity(aspect)}
            title="Periodicidad del aspecto"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "grupos":
        return (
          <SharedEntityCell
            value={standard.gruposMinisteriales.map((item) => item.grupoMinisterial.nombre).join(" · ") || "Sin clasificación"}
            title="Grupos ministeriales"
            canEdit={canEdit}
            onEdit={() => onEditStandard(standard)}
          />
        );
      case "responsable":
        return (
          <MatrixTextEditor
            value={task.responsableActividad}
            title="Responsable de la actividad"
            canEdit={canEdit}
            onSave={(value) => patch({ responsableActividad: value.trim() || null })}
          />
        );
      case "soportes":
        return (
          <MatrixTextEditor
            value={task.fundamentosSoportes}
            title="Fundamentos y soportes"
            canEdit={canEdit}
            onSave={(value) => patch({ fundamentosSoportes: value.trim() || null })}
          />
        );
      case "metas":
        return (
          <MatrixTextEditor
            value={task.metasEstandar}
            title="Metas del estándar"
            canEdit={canEdit}
            onSave={(value) => patch({ metasEstandar: value.trim() || null })}
          />
        );
      case "recursos":
        return (
          <MatrixTextEditor
            value={task.recursosAdministrativos}
            title="Recursos administrativos"
            canEdit={canEdit}
            onSave={(value) => patch({ recursosAdministrativos: value.trim() || null })}
          />
        );
      case "palabrasClave":
        return (
          <SharedEntityCell
            value={aspect.palabrasClave?.map((item) => item.palabraClave.nombre).join(", ") || "—"}
            title="Palabras clave"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "tareaCotidiana":
        return (
          <SharedEntityCell
            value={formatDailyTask(aspect)}
            title="Tarea de ejecución cotidiana"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "evergreen":
        return (
          <SharedEntityCell
            value={aspect.configuracion?.esEvergreen ? "Sí" : "No"}
            title="Configuración Evergreen"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "revisionTecnica":
        return (
          <SharedEntityCell
            value={aspect.configuracionRevision?.requiereRevisionTecnica ? "Sí" : "No"}
            title="Revisión técnica"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "evidencia":
        return (
          <SharedEntityCell
            value={aspect.configuracionEvidencia?.requiereEvidencia
              ? textOrDash(aspect.configuracionEvidencia.descripcionEvidencia) === "—"
                ? "Requerida"
                : textOrDash(aspect.configuracionEvidencia.descripcionEvidencia)
              : "No requerida"}
            title="Evidencia"
            canEdit={canEdit}
            onEdit={() => onEditAspect(aspect)}
          />
        );
      case "estado":
        return (
          <MatrixSelectEditor
            value={task.estado}
            display={task.estado}
            title="Estado de la fila"
            canEdit={canEdit}
            options={[
              { value: "ACTIVO", label: "ACTIVO" },
              { value: "INACTIVO", label: "INACTIVO" },
            ]}
            onSave={(value) => patch({ estado: value as MatrixTaskPayload["estado"] })}
          />
        );
      case "acciones":
        return (
          <div className="flex items-center gap-1 px-1 py-1">
            <ActionButton label="Ver detalle" onClick={onView}><Eye size={15} /></ActionButton>
            {canEdit && (
              <>
                <ActionButton label="Editar fila" onClick={onEdit}><Edit2 size={15} /></ActionButton>
                <ActionButton label="Desactivar" onClick={onDeactivate} danger disabled={isDeactivating}>
                  {isDeactivating ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </ActionButton>
              </>
            )}
          </div>
        );
    }
  }
}

function MatrixBodyCell({
  column,
  children,
}: {
  column: MatrixColumnDefinition;
  children: ReactNode;
}) {
  const sticky = column.stickyLeft !== undefined;
  const tone = {
    neutral: "bg-[#101010]",
    teal: "bg-[#0b2427]",
    amber: "bg-[#2a2110]",
    blue: "bg-[#101928]",
    violet: "bg-[#191326]",
  }[column.tone ?? "neutral"];

  const style: CSSProperties = {
    width: column.width,
    minWidth: column.width,
    maxWidth: column.width,
    ...(sticky ? { left: column.stickyLeft } : {}),
  };

  return (
    <td
      style={style}
      className={`border-b border-r border-neutral-800/90 p-1 align-top leading-5 text-neutral-300 ${tone} ${
        sticky ? "sticky z-20 shadow-[8px_0_18px_rgba(0,0,0,.16)]" : ""
      }`}
    >
      {children}
    </td>
  );
}

function SharedEntityCell({
  value,
  title,
  canEdit,
  onEdit,
}: {
  value: string;
  title: string;
  canEdit: boolean;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <MatrixCellMenu
      open={open}
      onOpenChange={setOpen}
      disabled={!canEdit}
      title={title}
      label={<span className="text-neutral-200">{value}</span>}
      minWidth={330}
    >
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          onEdit();
        }}
        className="flex w-full items-center gap-3 rounded-xl border border-neutral-800 px-3 py-3 text-left text-sm text-neutral-200 hover:border-cyan-500/30 hover:bg-cyan-500/5"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
          <Pencil size={15} />
        </span>
        Editar {title.toLowerCase()}
      </button>
    </MatrixCellMenu>
  );
}

function PlainValue({ value }: { value: string }) {
  return (
    <div className="whitespace-pre-wrap break-words px-2 py-1.5 text-neutral-300">
      {value}
    </div>
  );
}

function ActionButton({
  label,
  children,
  onClick,
  danger = false,
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-40 ${
        danger
          ? "border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
