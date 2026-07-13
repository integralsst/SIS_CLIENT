import type {
  Company,
  CompanySummary,
} from "../../../types/domain";

export type EstadoEvaluacion =
  | "BORRADOR"
  | "EN_PROGRESO"
  | "COMPLETADA"
  | "CERRADA";

export type EstadoAplicabilidad =
  | "APLICA"
  | "NO_APLICA"
  | "PENDIENTE_REVISION";

export type EstadoCumplimiento =
  | "PENDIENTE"
  | "CUMPLE"
  | "CUMPLE_PARCIAL"
  | "NO_CUMPLE"
  | "NO_APLICA";

export type TipoEvaluador =
  | "EMPRESA"
  | "ADMINISTRACION"
  | "PROFESIONAL"
  | "AUDITOR";

export type PrioridadAccion =
  | "BAJA"
  | "MEDIA"
  | "ALTA"
  | "CRITICA";

export type EstadoAccion =
  | "PENDIENTE"
  | "EN_PROGRESO"
  | "BLOQUEADA"
  | "COMPLETADA"
  | "CANCELADA";

export interface CicloPhva {
  id: string;
  codigo: string;
  nombre: string;
  porcentajeEsperado: string | number;
  ordenVisualizacion: number;
}

export interface CategoriaEstandar {
  id: string;
  codigo: string;
  nombre: string;
  porcentajeEsperado: string | number;
  ordenVisualizacion: number;
  cicloPhva?: CicloPhva;
}

export interface EstandarMinimo {
  id: string;
  codigo: string;
  nombre: string;
  puntajeMaximo: string | number;
  metaGeneral: string | null;
  ordenVisualizacion: number;
  categoria?: CategoriaEstandar;
}

export interface PerfilAplicabilidad {
  id: string;
  codigo: string;
  nombre: string;
  cantidadEstandares: number | null;
  descripcion: string | null;
  activo: boolean;
}

export interface MarcoSgsst {
  id: string;
  codigo: string;
  nombre: string;
  version: string;
  descripcion: string | null;
  puntajeTotal: string | number;
  vigenteDesde: string | null;
  vigenteHasta: string | null;
  activo: boolean;
  ciclos?: Array<
    CicloPhva & {
      categorias?: CategoriaEstandar[];
    }
  >;
  perfilesAplicabilidad?: PerfilAplicabilidad[];
}

export interface ConfiguracionSgsstEmpresa {
  id: string;
  empresaId: string;
  marcoId: string;
  perfilAplicabilidadId: string;
  vigenteDesde: string;
  vigenteHasta: string | null;
  activo: boolean;
  notas: string | null;
  creadoEn: string;
  actualizadoEn: string;
  empresa: {
    id: string;
    nit: string;
    nombre: string;
    activo: boolean;
  };
  marco: MarcoSgsst;
  perfilAplicabilidad: PerfilAplicabilidad;
  creadoPorUsuario: {
    id: string;
    nombre: string;
    correo: string;
  } | null;
  _count?: {
    evaluaciones: number;
  };
}

export interface ProcesoSgsst {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
}

export interface FrecuenciaActualizacion {
  id: string;
  codigo: string;
  nombre: string;
  valorIntervalo: number | null;
  unidadIntervalo:
    | "DIA"
    | "SEMANA"
    | "MES"
    | "ANIO"
    | null;
  noAplica: boolean;
}

export interface BloqueDocumental {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
}

export interface Requisito {
  id: string;
  codigo: string;
  descripcion: string;
  plantillaAccion: string | null;
  guiaEjecucion: string | null;
  meta: string | null;
  incluirEnInformeTareas: boolean;
  esTareaRutinaria: boolean;
  ordenVisualizacion: number;
  proceso: ProcesoSgsst | null;
  frecuenciaActualizacion:
    | FrecuenciaActualizacion
    | null;
  bloqueDocumental: BloqueDocumental | null;
  estandar: EstandarMinimo & {
    categoria: CategoriaEstandar & {
      cicloPhva: CicloPhva;
    };
  };
  areasGestion: Array<{
    id: string;
    areaGestion: {
      id: string;
      codigo: string;
      nombre: string;
    };
  }>;
  rolesResponsables: Array<{
    id: string;
    esPrincipal: boolean;
    rolResponsable: {
      id: string;
      codigo: string;
      nombre: string;
    };
  }>;
  evidenciasRequeridas: Array<{
    id: string;
    nombre: string;
    descripcion: string | null;
    obligatoria: boolean;
    requiereVencimiento: boolean;
    ordenVisualizacion: number;
  }>;
  recursos: Array<{
    id: string;
    descripcion: string;
    ordenVisualizacion: number;
  }>;
  palabrasClave: Array<{
    id: string;
    palabraClave: {
      id: string;
      nombre: string;
    };
  }>;
  referenciasLegales: Array<{
    id: string;
    articulo: string | null;
    descripcion: string | null;
    normaLegal: {
      id: string;
      tipoNorma: string;
      numero: string;
      anio: number | null;
      nombre: string | null;
    };
  }>;
}

export interface RespuestaEvaluacion {
  id: string;
  tipoEvaluador: TipoEvaluador;
  estadoCumplimiento: EstadoCumplimiento;
  observaciones: string | null;
  respondidoEn: string;
  respondidoPorUsuario: {
    id: string;
    nombre: string;
    correo: string;
  } | null;
}

export interface ItemEvaluacion {
  id: string;
  evaluacionId: string;
  requisitoId: string;
  profesionalResponsableId: string | null;
  estadoAplicabilidad: EstadoAplicabilidad;
  estadoCumplimiento: EstadoCumplimiento;
  observaciones: string | null;
  fechaLimite: string | null;
  evaluadoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
  profesionalResponsable: {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
  } | null;
  respuestas: RespuestaEvaluacion[];
  requisito: Requisito;
  _count?: {
    planesAccion: number;
    documentosEvidencia: number;
  };
}

export interface CalificacionEstandar {
  id: string;
  evaluacionId: string;
  estandarId: string;
  tipoEvaluador: TipoEvaluador;
  puntajeMaximo: string | number;
  puntajeObtenido: string | number;
  observaciones: string | null;
  calculadoEn: string;
  estandar?: EstandarMinimo & {
    categoria?: CategoriaEstandar & {
      cicloPhva?: CicloPhva;
    };
  };
}

export interface EvaluacionResumen {
  id: string;
  empresaId: string;
  configuracionSgsstEmpresaId: string;
  nombre: string;
  anioPeriodo: number;
  estado: EstadoEvaluacion;
  iniciadaEn: string | null;
  cerradaEn: string | null;
  notas: string | null;
  creadoEn: string;
  actualizadoEn: string;
  empresa: {
    id: string;
    nit: string;
    nombre: string;
  };
  configuracionSgsstEmpresa: {
    id: string;
    marco: MarcoSgsst;
    perfilAplicabilidad: PerfilAplicabilidad;
  };
  creadoPorUsuario: {
    id: string;
    nombre: string;
    correo: string;
  } | null;
  _count: {
    itemsEvaluacion: number;
    calificacionesEstandares: number;
  };
}

export interface EvaluacionDetalle
  extends EvaluacionResumen {
  itemsEvaluacion: ItemEvaluacion[];
  calificacionesEstandares: CalificacionEstandar[];
}

export interface ResumenCalificacion {
  tipoEvaluador: TipoEvaluador;
  puntajeObtenido: number;
  puntajeMaximo: number;
  porcentaje: number;
  pendientes: number;
  calificaciones: Array<{
    estandarId: string;
    codigo: string;
    nombre: string;
    puntajeObtenido: number;
    puntajeMaximo: number;
    totalItems: number;
    itemsAplicables: number;
  }>;
}

export interface PlanAccion {
  id: string;
  empresaId: string;
  requisitoId: string;
  itemEvaluacionId: string | null;
  descripcion: string;
  prioridad: PrioridadAccion;
  estado: EstadoAccion;
  fechaInicioPlanificada: string | null;
  fechaLimite: string | null;
  completadaEn: string | null;
  porcentajeAvance: number;
  notas: string | null;
  creadoEn: string;
  actualizadoEn: string;
  empresa: {
    id: string;
    nit: string;
    nombre: string;
  };
  requisito: {
    id: string;
    codigo: string;
    descripcion: string;
    estandar: EstandarMinimo;
    proceso: ProcesoSgsst | null;
  };
  profesionalResponsable: {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
  } | null;
  avances: Array<{
    id: string;
    porcentajeAvance: number;
    notas: string | null;
    registradoEn: string;
  }>;
  _count?: {
    documentosEvidencia: number;
  };
}

export interface CrearConfiguracionInput {
  marcoId: string;
  perfilAplicabilidadId: string;
  vigenteDesde: string;
  vigenteHasta?: string | null;
  notas?: string | null;
}

export interface CrearEvaluacionInput {
  empresaId: string;
  configuracionSgsstEmpresaId: string;
  nombre: string;
  anioPeriodo: number;
  notas?: string | null;
}

export interface ActualizarItemInput {
  estadoAplicabilidad?: EstadoAplicabilidad;
  estadoCumplimiento?: EstadoCumplimiento;
  observaciones?: string | null;
  fechaLimite?: string | null;
  profesionalResponsableId?: string | null;
}

export interface GuardarRespuestaInput {
  estadoCumplimiento: EstadoCumplimiento;
  observaciones?: string | null;
  tipoEvaluador?: TipoEvaluador;
}

export type EmpresaSgsst = Company;
export type EmpresaSgsstResumen = CompanySummary;
