import type {
  AspectCatalog,
  MatrixTask,
  MatrixTaskPayload,
  PeriodicityUnit,
} from "../../types/supermatriz.types";
import type {
  MatrixColumnDefinition,
  MatrixColumnKey,
} from "./matrixGrid.types";

export const MATRIX_COLUMNS: MatrixColumnDefinition[] = [
  { key: "orden", label: "Orden", width: 74, defaultVisible: true, stickyLeft: 0 },
  { key: "proceso", label: "Proceso", width: 250, defaultVisible: true, stickyLeft: 74, tone: "teal" },
  { key: "aspecto", label: "Aspecto", width: 370, defaultVisible: true, stickyLeft: 324, tone: "amber" },
  { key: "planAccion", label: "Plan de acción específico", width: 350, defaultVisible: true, tone: "blue" },
  { key: "codigo", label: "Código fila", width: 130, defaultVisible: true },
  { key: "informeTareas", label: "Informe estado tareas", width: 155, defaultVisible: true },
  { key: "ciclo", label: "Ciclo PHVA", width: 190, defaultVisible: true },
  { key: "porcentajeCiclo", label: "% esperado ciclo", width: 135, defaultVisible: true },
  { key: "categoria", label: "Categoría del estándar", width: 280, defaultVisible: true },
  { key: "porcentajeCategoria", label: "% esperado categoría", width: 155, defaultVisible: true },
  { key: "estandar", label: "Estándar", width: 350, defaultVisible: true },
  { key: "calificacionMinisterial", label: "Calif. ministerial esperada", width: 175, defaultVisible: true },
  { key: "gestion", label: "Categorías de gestión", width: 240, defaultVisible: true, tone: "violet" },
  { key: "ejecucion", label: "Ejecución", width: 320, defaultVisible: true },
  { key: "documentoPeriodico", label: "Documento actual periódico", width: 185, defaultVisible: true },
  { key: "periodicidad", label: "Periodicidad", width: 190, defaultVisible: true },
  { key: "grupos", label: "7 / 21 / 60 estándares", width: 210, defaultVisible: true },
  { key: "responsable", label: "Responsable de la actividad", width: 260, defaultVisible: true },
  { key: "soportes", label: "Fundamentos y soportes", width: 340, defaultVisible: true },
  { key: "metas", label: "Metas del estándar", width: 320, defaultVisible: true },
  { key: "recursos", label: "Recursos administrativos", width: 300, defaultVisible: true },
  { key: "palabrasClave", label: "Palabras clave", width: 280, defaultVisible: true },
  { key: "tareaCotidiana", label: "Tarea de ejecución cotidiana", width: 220, defaultVisible: true },
  { key: "evergreen", label: "Evergreen", width: 135, defaultVisible: true },
  { key: "revisionTecnica", label: "Revisión técnica", width: 170, defaultVisible: true },
  { key: "evidencia", label: "Evidencia", width: 210, defaultVisible: true },
  { key: "estado", label: "Estado", width: 135, defaultVisible: true },
  { key: "acciones", label: "Acciones", width: 150, defaultVisible: true },
];

export const DEFAULT_VISIBLE_COLUMNS = MATRIX_COLUMNS
  .filter((column) => column.defaultVisible)
  .map((column) => column.key);

export function taskToPayload(task: MatrixTask): MatrixTaskPayload {
  return {
    versionSupermatrizId: task.versionSupermatrizId,
    aspectoId: task.aspectoId,
    procesoId: task.procesoId,
    codigo: task.codigo,
    orden: task.orden,
    ejecucion: task.ejecucion,
    fundamentosSoportes: task.fundamentosSoportes,
    responsableActividad: task.responsableActividad,
    metasEstandar: task.metasEstandar,
    recursosAdministrativos: task.recursosAdministrativos,
    estado: task.estado,
    categoriaGestionIds: task.categoriasGestion.map(
      (item) => item.categoriaGestionId
    ),
  };
}

const UNIT_LABEL: Record<PeriodicityUnit, string> = {
  DIA: "día(s)",
  SEMANA: "semana(s)",
  MES: "mes(es)",
  ANIO: "año(s)",
};

export function formatPeriodicity(aspect: AspectCatalog): string {
  const validity = aspect.configuracionVigencia;

  if (!validity?.cantidad || !validity.unidad) {
    return "Anual por defecto";
  }

  return `Cada ${validity.cantidad} ${UNIT_LABEL[validity.unidad]}`;
}

export function formatDailyTask(aspect: AspectCatalog): string {
  if (!aspect.configuracion?.tareaEjecucionCotidiana) {
    return "No";
  }

  const config = aspect.configuracionTareaCotidiana;
  if (!config) return "Sí";

  return `${config.cantidadObjetivo} ${UNIT_LABEL[config.unidad]}`;
}

export function textOrDash(value: string | null | undefined): string {
  return value?.trim() || "—";
}

export function columnTotalWidth(columns: MatrixColumnKey[]): number {
  return MATRIX_COLUMNS
    .filter((column) => columns.includes(column.key))
    .reduce((total, column) => total + column.width, 0);
}
