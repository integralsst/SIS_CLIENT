export type RecordStatus = "ACTIVO" | "INACTIVO";
export type MatrixVersionStatus = "BORRADOR" | "VIGENTE" | "CERRADA";

export interface PhvaCycle {
  id: number;
  codigo: string;
  nombre: string;
  orden: number;
  porcentajeEsperado: string | number | null;
  estado: RecordStatus;
}

export interface StandardCategory {
  id: number;
  cicloPhvaId: number;
  codigo: string | null;
  nombre: string;
  orden: number;
  porcentajeEsperado: string | number | null;
  estado: RecordStatus;
  cicloPhva: PhvaCycle;
}

export interface MinisterialGroup {
  id: number;
  codigo: "ESTANDARES_7" | "ESTANDARES_21" | "ESTANDARES_60";
  nombre: string;
  porcentajeEvaluable: string | number;
  porcentajeComplemento: string | number;
  estado: RecordStatus;
}

export interface Standard {
  id: number;
  categoriaEstandarId: number;
  codigo: string | null;
  nombre: string;
  orden: number;
  calificacionMinisterialEsperada: string | number | null;
  estado: RecordStatus;
  categoriaEstandar: StandardCategory;
  gruposMinisteriales: Array<{
    grupoMinisterialId: number;
    grupoMinisterial: MinisterialGroup;
  }>;
}

export interface ProcessCatalog {
  id: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  estado: RecordStatus;
}

export interface ManagementCategory {
  id: number;
  codigo: "DOCUMENTAL" | "INTERVENCION" | "EMERGENCIAS";
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

export interface AspectCatalog {
  id: number;
  estandarId: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  orden: number;
  estado: RecordStatus;
  planAccionEspecifico: SpecificActionPlan | null;
  estandar: Standard;
  configuracion?: {
    esEvergreen: boolean;
    bloqueEvergreen: string | null;
    documentoActualizacionPeriodica: boolean;
    tareaEjecucionCotidiana: boolean;
    incluirInformeEstadoTareas: boolean;
    permiteNoAplica: boolean;
  } | null;
  configuracionVigencia?: {
    cantidad: number | null;
    unidad: string | null;
    diasAlertaPrevia: number;
    descripcionRegla: string | null;
  } | null;
  configuracionEvidencia?: {
    requiereEvidencia: boolean;
    descripcionEvidencia: string | null;
  } | null;
  configuracionRevision?: {
    requiereRevisionTecnica: boolean;
    observaciones: string | null;
  } | null;
}

export interface MatrixVersion {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: MatrixVersionStatus;
  vigenteDesde: string | null;
  vigenteHasta: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tareas: number;
    cambios?: number;
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
  fundamentosSoportes: string | null;
  responsableActividad: string | null;
  metasEstandar: string | null;
  recursosAdministrativos: string | null;
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
  fundamentosSoportes: string | null;
  responsableActividad: string | null;
  metasEstandar: string | null;
  recursosAdministrativos: string | null;
  estado: RecordStatus;
  categoriaGestionIds: number[];
}

export interface MatrixVersionPayload {
  nombre: string;
  descripcion: string | null;
  estado: MatrixVersionStatus;
  vigenteDesde: string | null;
  vigenteHasta: string | null;
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
