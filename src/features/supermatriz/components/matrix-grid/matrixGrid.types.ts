export type MatrixColumnKey =
  | "orden"
  | "codigo"
  | "proceso"
  | "aspecto"
  | "planAccion"
  | "informeTareas"
  | "ciclo"
  | "porcentajeCiclo"
  | "categoria"
  | "porcentajeCategoria"
  | "estandar"
  | "calificacionMinisterial"
  | "gestion"
  | "ejecucion"
  | "documentoPeriodico"
  | "periodicidad"
  | "grupos"
  | "responsable"
  | "soportes"
  | "metas"
  | "recursos"
  | "palabrasClave"
  | "tareaCotidiana"
  | "evergreen"
  | "revisionTecnica"
  | "evidencia"
  | "estado"
  | "acciones";

export interface MatrixColumnDefinition {
  key: MatrixColumnKey;
  label: string;
  width: number;
  defaultVisible: boolean;
  stickyLeft?: number;
  tone?: "neutral" | "teal" | "amber" | "blue" | "violet";
}
