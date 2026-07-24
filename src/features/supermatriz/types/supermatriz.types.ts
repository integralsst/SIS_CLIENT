export type RecordStatus =
  | "ACTIVO"
  | "INACTIVO";

export type MatrixVersionStatus =
  | "BORRADOR"
  | "VIGENTE"
  | "CERRADA";

export type EvergreenBlock =
  | "PRIMER_CUATRIMESTRE"
  | "SEGUNDO_CUATRIMESTRE"
  | "TERCER_CUATRIMESTRE";

export type PeriodicityUnit =
  | "DIA"
  | "SEMANA"
  | "MES"
  | "ANIO";

export type BaseDateType =
  | "FECHA_DOCUMENTO"
  | "FECHA_ULTIMA_REVISION"
  | "FECHA_FIJA_CALENDARIO";

export type PeriodicitySource =
  | "NORMATIVA"
  | "DIRECTRIZ_INTERNA"
  | "CONFIGURACION_TECNICA";

export type ManagementMode =
  | "PRESENCIAL"
  | "REMOTA"
  | "OFICINA"
  | "SEGUIMIENTO_PUNTUAL";

export interface PhvaCycle {
  id: number;
  versionSupermatrizId: number;
  codigo: string;
  nombre: string;
  orden: number;
  porcentajeEsperado:
    | string
    | number
    | null;
  estado: RecordStatus;
}

export interface StandardCategory {
  id: number;
  versionSupermatrizId: number;
  cicloPhvaId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  porcentajeEsperado:
    | string
    | number
    | null;
  estado: RecordStatus;
  cicloPhva: PhvaCycle;
}

export interface MinisterialGroup {
  id: number;
  codigo:
    | "ESTANDARES_7"
    | "ESTANDARES_21"
    | "ESTANDARES_60";
  nombre: string;
  porcentajeEvaluable:
    | string
    | number;
  porcentajeComplemento:
    | string
    | number;
  estado: RecordStatus;
}

export interface Standard {
  id: number;
  versionSupermatrizId: number;
  categoriaEstandarId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  calificacionMinisterialEsperada:
    | string
    | number
    | null;
  estado: RecordStatus;
  categoriaEstandar: StandardCategory;
  gruposMinisteriales: Array<{
    grupoMinisterialId: number;
    grupoMinisterial: MinisterialGroup;
  }>;
  _count?: {
    aspectos: number;
  };
}

export interface ProcessCatalog {
  id: number;
  versionSupermatrizId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  estado: RecordStatus;
  _count?: {
    tareas: number;
  };
}

export interface ManagementCategory {
  id: number;
  codigo:
    | "DOCUMENTAL"
    | "INTERVENCION"
    | "EMERGENCIAS";
  nombre: string;
  descripcion: string | null;
  estado: RecordStatus;
}

export interface SpecificActionPlan {
  id: number;
  aspectoId: number;
  descripcion: string;
  estado: RecordStatus;
}

export interface AspectKeywordRelation {
  palabraClaveId: number;
  palabraClave: {
    id: number;
    nombre: string;
  };
}

export interface AspectRequirementRelation {
  requisitoNormativoId: number;
  requisitoNormativo: {
    id: number;
    norma: string;
    articulo: string | null;
    descripcion: string | null;
    estado: RecordStatus;
  };
}

export interface ApprovalRule {
  id: number;
  modalidad: ManagementMode | null;
  tipoActividad: string | null;
  criterio: string;
  requiereAprobacion: boolean;
  estado: RecordStatus;
}

export interface AspectCatalog {
  id: number;
  versionSupermatrizId: number;
  estandarId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  estado: RecordStatus;
  planAccionEspecifico:
    | SpecificActionPlan
    | null;
  estandar: Standard;
  configuracion?: {
    esEvergreen: boolean;
    bloqueEvergreen:
      | EvergreenBlock
      | null;
    documentoActualizacionPeriodica: boolean;
    tareaEjecucionCotidiana: boolean;
    incluirInformeEstadoTareas: boolean;
    permiteNoAplica: boolean;
  } | null;
  configuracionVigencia?: {
    tipoFechaBase: BaseDateType;
    fuentePeriodicidad: PeriodicitySource;
    cantidad: number | null;
    unidad: PeriodicityUnit | null;
    diasAlertaPrevia: number;
    permiteFechaManual: boolean;
    mesFechaFija: number | null;
    diaFechaFija: number | null;
    descripcionRegla: string | null;
  } | null;
  configuracionTareaCotidiana?: {
    cantidadObjetivo: number;
    unidad: PeriodicityUnit;
    descripcion: string | null;
  } | null;
  configuracionEvidencia?: {
    requiereEvidencia: boolean;
    descripcionEvidencia:
      | string
      | null;
    visibleClienteDefault: boolean;
  } | null;
  configuracionRevision?: {
    requiereRevisionTecnica: boolean;
    observaciones: string | null;
  } | null;
  palabrasClave?: AspectKeywordRelation[];
  requisitosNormativos?: AspectRequirementRelation[];
  reglasAprobacion?: ApprovalRule[];
}

export interface MatrixVersion {
  id: number;
  clonadaDeId: number | null;
  nombre: string;
  descripcion: string | null;
  estado: MatrixVersionStatus;
  vigenteDesde: string | null;
  vigenteHasta: string | null;
  createdAt: string;
  updatedAt: string;
  clonadaDe?: {
    id: number;
    nombre: string;
  } | null;
  _count?: {
    tareas: number;
    cambios: number;
    ciclosPhva: number;
    categoriasEstandar: number;
    estandares: number;
    aspectos: number;
    procesos: number;
  };
}

export interface MatrixTask {
  id: number;
  versionSupermatrizId: number;
  aspectoId: number;
  procesoId: number;
  codigo: string | null;
  orden: number;
  ejecucion: string | null;
  fundamentosSoportes:
    | string
    | null;
  responsableActividad:
    | string
    | null;
  metasEstandar: string | null;
  recursosAdministrativos:
    | string
    | null;
  estado: RecordStatus;
  createdAt: string;
  updatedAt: string;
  versionSupermatriz: MatrixVersion;
  proceso: ProcessCatalog;
  aspecto: AspectCatalog;
  categoriasGestion: Array<{
    categoriaGestionId: number;
    categoriaGestion: ManagementCategory;
  }>;
}

export interface MatrixCatalogs {
  ciclosPhva: PhvaCycle[];
  categoriasEstandar: StandardCategory[];
  estandares: Standard[];
  procesos: ProcessCatalog[];
  aspectos: AspectCatalog[];
  categoriasGestion: ManagementCategory[];
  gruposMinisteriales: MinisterialGroup[];
  versiones: MatrixVersion[];
}

export interface MatrixFilters {
  versionSupermatrizId: string;
  cicloPhvaId: string;
  categoriaEstandarId: string;
  estandarId: string;
  procesoId: string;
  categoriaGestionId: string;
  grupoMinisterialId: string;
  estado: RecordStatus;
  busqueda: string;
  pagina: number;
  limite: number;
}

export interface MatrixTaskPayload {
  versionSupermatrizId: number;
  aspectoId: number;
  procesoId: number;
  codigo: string | null;
  orden: number;
  ejecucion: string | null;
  fundamentosSoportes:
    | string
    | null;
  responsableActividad:
    | string
    | null;
  metasEstandar: string | null;
  recursosAdministrativos:
    | string
    | null;
  estado: RecordStatus;
  categoriaGestionIds: number[];
}

export interface MatrixVersionPayload {
  nombre: string;
  descripcion: string | null;
  vigenteDesde: string | null;
  vigenteHasta: string | null;
}

export interface CyclePayload {
  versionSupermatrizId: number;
  codigo: string;
  nombre: string;
  orden: number;
  porcentajeEsperado:
    | number
    | null;
  estado: RecordStatus;
}

export interface StandardCategoryPayload {
  versionSupermatrizId: number;
  cicloPhvaId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  porcentajeEsperado:
    | number
    | null;
  estado: RecordStatus;
}

export interface StandardPayload {
  versionSupermatrizId: number;
  categoriaEstandarId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  calificacionMinisterialEsperada:
    | number
    | null;
  estado: RecordStatus;
  grupoMinisterialIds: number[];
}

export interface ProcessPayload {
  versionSupermatrizId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  estado: RecordStatus;
}

export interface RequirementPayload {
  norma: string;
  articulo: string | null;
  descripcion: string | null;
}

export interface ApprovalRulePayload {
  modalidad: ManagementMode | null;
  tipoActividad: string | null;
  criterio: string;
  requiereAprobacion: boolean;
}

export interface AspectPayload {
  versionSupermatrizId: number;
  estandarId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  estado: RecordStatus;
  planAccionEspecifico: string;
  configuracion: {
    esEvergreen: boolean;
    bloqueEvergreen:
      | EvergreenBlock
      | null;
    documentoActualizacionPeriodica: boolean;
    tareaEjecucionCotidiana: boolean;
    incluirInformeEstadoTareas: boolean;
    permiteNoAplica: boolean;
  };
  configuracionVigencia: {
    tipoFechaBase: BaseDateType;
    fuentePeriodicidad: PeriodicitySource;
    cantidad: number | null;
    unidad: PeriodicityUnit | null;
    diasAlertaPrevia: number;
    permiteFechaManual: boolean;
    mesFechaFija: number | null;
    diaFechaFija: number | null;
    descripcionRegla: string | null;
  };
  configuracionEvidencia: {
    requiereEvidencia: boolean;
    descripcionEvidencia:
      | string
      | null;
    visibleClienteDefault: boolean;
  };
  configuracionRevision: {
    requiereRevisionTecnica: boolean;
    observaciones: string | null;
  };
  configuracionTareaCotidiana: {
    cantidadObjetivo: number;
    unidad: PeriodicityUnit;
    descripcion: string | null;
  } | null;
  palabrasClave: string[];
  requisitosNormativos: RequirementPayload[];
  reglasAprobacion: ApprovalRulePayload[];
}

export interface MatrixTaskListResponse {
  items: MatrixTask[];
  paginacion: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export interface HistoryItem {
  id: number;
  versionSupermatrizId:
    | number
    | null;
  tipoEntidad: string;
  entidadId: number | null;
  accion: string;
  descripcion: string | null;
  datosAntes: unknown;
  datosDespues: unknown;
  createdAt: string;
  versionSupermatriz: {
    id: number;
    nombre: string;
    estado: MatrixVersionStatus;
  } | null;
  usuario: {
    id: string;
    nombre: string;
    correo: string;
  } | null;
}

export interface HistoryResponse {
  items: HistoryItem[];
  paginacion: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export type SupermatrizTab =
  | "matriz"
  | "estructura"
  | "versiones"
  | "historial";

// ======================================================
// CONSTRUCCIÓN GUIADA DE FILA EN ORDEN INVERSO
// ======================================================

export type BuilderEntityMode =
  | "EXISTENTE"
  | "NUEVO";

export interface ExistingBuilderReference {
  modo: "EXISTENTE";
  id: number;
}

export interface NewBuilderReference<TData> {
  modo: "NUEVO";
  datos: TData;
}

export type BuilderReference<TData> =
  | ExistingBuilderReference
  | NewBuilderReference<TData>;

export type BuilderCycleDraft = Omit<
  CyclePayload,
  "versionSupermatrizId"
>;

export type BuilderCategoryDraft = Omit<
  StandardCategoryPayload,
  "versionSupermatrizId" | "cicloPhvaId"
>;

export type BuilderStandardDraft = Omit<
  StandardPayload,
  "versionSupermatrizId" | "categoriaEstandarId"
>;

export type BuilderAspectDraft = Omit<
  AspectPayload,
  "versionSupermatrizId" | "estandarId"
>;

export type BuilderProcessDraft = Omit<
  ProcessPayload,
  "versionSupermatrizId"
>;

export type BuilderTaskDraft = Omit<
  MatrixTaskPayload,
  "versionSupermatrizId" | "aspectoId" | "procesoId"
>;

export interface BuildMatrixRowPayload {
  versionSupermatrizId: number;
  tareaId: number | null;
  aspecto: BuilderReference<BuilderAspectDraft>;
  estandar?: BuilderReference<BuilderStandardDraft>;
  categoria?: BuilderReference<BuilderCategoryDraft>;
  ciclo?: BuilderReference<BuilderCycleDraft>;
  proceso: BuilderReference<BuilderProcessDraft>;
  fila: BuilderTaskDraft;
}

export interface BuildMatrixRowResponse {
  operacion: "CREAR" | "ACTUALIZAR";
  tarea: MatrixTask;
  creados: {
    cicloPhvaId: number | null;
    categoriaEstandarId: number | null;
    estandarId: number | null;
    aspectoId: number | null;
    procesoId: number | null;
  };
}
