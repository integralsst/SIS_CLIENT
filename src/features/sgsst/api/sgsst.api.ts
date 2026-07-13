import { apiRequest } from "../../../lib/api";
import type { Company } from "../../../types/domain";
import type {
  ActualizarItemInput,
  ConfiguracionSgsstEmpresa,
  CrearConfiguracionInput,
  CrearEvaluacionInput,
  EvaluacionDetalle,
  EvaluacionResumen,
  GuardarRespuestaInput,
  ItemEvaluacion,
  MarcoSgsst,
  PlanAccion,
  RespuestaEvaluacion,
  ResumenCalificacion,
} from "../types/sgsst.types";

function queryString(
  values: Record<
    string,
    string | number | undefined | null
  >
): string {
  const params = new URLSearchParams();

  Object.entries(values).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        params.set(key, String(value));
      }
    }
  );

  const result = params.toString();
  return result ? `?${result}` : "";
}

export function obtenerEmpresasSgsst(
  token: string
): Promise<Company[]> {
  return apiRequest<Company[]>(
    "/api/companies",
    {},
    token
  );
}

export function obtenerEmpresaSgsst(
  empresaId: string,
  token: string
): Promise<Company> {
  return apiRequest<Company>(
    `/api/companies/${empresaId}`,
    {},
    token
  );
}

export function obtenerMarcosSgsst(
  token: string
): Promise<MarcoSgsst[]> {
  return apiRequest<MarcoSgsst[]>(
    "/api/sgsst/catalogo/marcos",
    {},
    token
  );
}

export function obtenerConfiguracionesEmpresa(
  empresaId: string,
  token: string
): Promise<ConfiguracionSgsstEmpresa[]> {
  return apiRequest<
    ConfiguracionSgsstEmpresa[]
  >(
    `/api/sgsst/configuraciones/empresa/${empresaId}`,
    {},
    token
  );
}

export function crearConfiguracionEmpresa(
  empresaId: string,
  input: CrearConfiguracionInput,
  token: string
): Promise<ConfiguracionSgsstEmpresa> {
  return apiRequest<ConfiguracionSgsstEmpresa>(
    `/api/sgsst/configuraciones/empresa/${empresaId}`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    token
  );
}

export function obtenerEvaluaciones(
  token: string,
  filtros: {
    empresaId?: string;
    anioPeriodo?: number;
    estado?: string;
  } = {}
): Promise<EvaluacionResumen[]> {
  return apiRequest<EvaluacionResumen[]>(
    `/api/sgsst/evaluaciones${queryString(
      filtros
    )}`,
    {},
    token
  );
}

export function crearEvaluacion(
  input: CrearEvaluacionInput,
  token: string
): Promise<EvaluacionResumen> {
  return apiRequest<EvaluacionResumen>(
    "/api/sgsst/evaluaciones",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    token
  );
}

export function obtenerEvaluacion(
  evaluacionId: string,
  token: string
): Promise<EvaluacionDetalle> {
  return apiRequest<EvaluacionDetalle>(
    `/api/sgsst/evaluaciones/${evaluacionId}`,
    {},
    token
  );
}

export function actualizarItemEvaluacion(
  evaluacionId: string,
  itemId: string,
  input: ActualizarItemInput,
  token: string
): Promise<ItemEvaluacion> {
  return apiRequest<ItemEvaluacion>(
    `/api/sgsst/evaluaciones/${evaluacionId}/items/${itemId}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    token
  );
}

export function guardarRespuestaEvaluacion(
  evaluacionId: string,
  itemId: string,
  input: GuardarRespuestaInput,
  token: string
): Promise<RespuestaEvaluacion> {
  return apiRequest<RespuestaEvaluacion>(
    `/api/sgsst/evaluaciones/${evaluacionId}/items/${itemId}/respuesta`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    token
  );
}

export function calcularEvaluacion(
  evaluacionId: string,
  token: string
): Promise<ResumenCalificacion> {
  return apiRequest<ResumenCalificacion>(
    `/api/sgsst/evaluaciones/${evaluacionId}/calcular`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
    token
  );
}

export function completarEvaluacion(
  evaluacionId: string,
  token: string
): Promise<{
  evaluacion: EvaluacionResumen;
  calificacion: ResumenCalificacion;
}> {
  return apiRequest<{
    evaluacion: EvaluacionResumen;
    calificacion: ResumenCalificacion;
  }>(
    `/api/sgsst/evaluaciones/${evaluacionId}/completar`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
    token
  );
}

export function obtenerPlanesAccion(
  token: string,
  filtros: {
    empresaId?: string;
    evaluacionId?: string;
    estado?: string;
  } = {}
): Promise<PlanAccion[]> {
  return apiRequest<PlanAccion[]>(
    `/api/sgsst/planes-accion${queryString(
      filtros
    )}`,
    {},
    token
  );
}
