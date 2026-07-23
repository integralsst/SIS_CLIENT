import type {
  AspectCatalog,
  AspectPayload,
  PeriodicityUnit,
} from "../../types/supermatriz.types";
import type {
  PeriodPreset,
} from "./guidedRow.types";

export function readId(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "number"
  ) {
    return value.id;
  }

  throw new Error(
    "El registro se guardó, pero el servidor no devolvió su identificador. Actualiza la matriz y selecciónalo manualmente."
  );
}

export function errorText(
  error: unknown
): string {
  return error instanceof Error
    ? error.message
    : "No fue posible guardar el registro.";
}

export function periodFromPreset(
  preset: PeriodPreset
): {
  amount: number;
  unit: "MES" | "ANIO";
} {
  switch (preset) {
    case "MENSUAL":
      return { amount: 1, unit: "MES" };
    case "TRIMESTRAL":
      return { amount: 3, unit: "MES" };
    case "SEMESTRAL":
      return { amount: 6, unit: "MES" };
    case "CADA_3_ANIOS":
      return { amount: 3, unit: "ANIO" };
    case "ANUAL":
    default:
      return { amount: 12, unit: "MES" };
  }
}

export function detectPeriodPreset(
  aspect: AspectCatalog | null
): PeriodPreset {
  const validity =
    aspect?.configuracionVigencia;

  if (
    validity?.unidad === "ANIO" &&
    validity.cantidad === 3
  ) {
    return "CADA_3_ANIOS";
  }

  if (validity?.unidad === "MES") {
    if (validity.cantidad === 1) {
      return "MENSUAL";
    }
    if (validity.cantidad === 3) {
      return "TRIMESTRAL";
    }
    if (validity.cantidad === 6) {
      return "SEMESTRAL";
    }
  }

  return "ANUAL";
}

export function getAspectPeriodicity(
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

export function buildAspectPayload({
  current,
  versionSupermatrizId,
  standardId,
  code,
  name,
  description,
  plan,
  order,
  isEvergreen,
  periodicDocument,
  requiresEvidence,
  requiresTechnicalReview,
  periodAmount,
  periodUnit,
}: {
  current: AspectCatalog | null;
  versionSupermatrizId: number;
  standardId: number;
  code: string;
  name: string;
  description: string;
  plan: string;
  order: string;
  isEvergreen: boolean;
  periodicDocument: boolean;
  requiresEvidence: boolean;
  requiresTechnicalReview: boolean;
  periodAmount: number;
  periodUnit: PeriodicityUnit;
}): AspectPayload {
  return {
    versionSupermatrizId,
    estandarId: standardId,
    codigo: code.trim() || null,
    nombre: name.trim(),
    descripcion:
      description.trim() || null,
    orden: Number(order),
    estado: current?.estado ?? "ACTIVO",
    planAccionEspecifico: plan.trim(),
    configuracion: {
      esEvergreen: isEvergreen,
      bloqueEvergreen: isEvergreen
        ? current?.configuracion
            ?.bloqueEvergreen ?? null
        : null,
      documentoActualizacionPeriodica:
        periodicDocument,
      tareaEjecucionCotidiana:
        current?.configuracion
          ?.tareaEjecucionCotidiana ?? false,
      incluirInformeEstadoTareas:
        current?.configuracion
          ?.incluirInformeEstadoTareas ??
        false,
      permiteNoAplica:
        current?.configuracion
          ?.permiteNoAplica ?? true,
    },
    configuracionVigencia: {
      tipoFechaBase:
        current?.configuracionVigencia
          ?.tipoFechaBase ??
        "FECHA_DOCUMENTO",
      fuentePeriodicidad:
        current?.configuracionVigencia
          ?.fuentePeriodicidad ??
        "CONFIGURACION_TECNICA",
      cantidad: periodAmount,
      unidad: periodUnit,
      diasAlertaPrevia:
        current?.configuracionVigencia
          ?.diasAlertaPrevia ?? 30,
      permiteFechaManual:
        current?.configuracionVigencia
          ?.permiteFechaManual ?? true,
      mesFechaFija:
        current?.configuracionVigencia
          ?.mesFechaFija ?? null,
      diaFechaFija:
        current?.configuracionVigencia
          ?.diaFechaFija ?? null,
      descripcionRegla:
        current?.configuracionVigencia
          ?.descripcionRegla ?? null,
    },
    configuracionEvidencia: {
      requiereEvidencia:
        requiresEvidence,
      descripcionEvidencia:
        current?.configuracionEvidencia
          ?.descripcionEvidencia ?? null,
      visibleClienteDefault:
        current?.configuracionEvidencia
          ?.visibleClienteDefault ?? false,
    },
    configuracionRevision: {
      requiereRevisionTecnica:
        requiresTechnicalReview,
      observaciones:
        current?.configuracionRevision
          ?.observaciones ?? null,
    },
    configuracionTareaCotidiana:
      current?.configuracionTareaCotidiana
        ? {
            cantidadObjetivo:
              current
                .configuracionTareaCotidiana
                .cantidadObjetivo,
            unidad:
              current
                .configuracionTareaCotidiana
                .unidad,
            descripcion:
              current
                .configuracionTareaCotidiana
                .descripcion,
          }
        : null,
    palabrasClave:
      current?.palabrasClave?.map(
        (item) =>
          item.palabraClave.nombre
      ) ?? [],
    requisitosNormativos:
      current?.requisitosNormativos?.map(
        (item) => ({
          norma:
            item.requisitoNormativo.norma,
          articulo:
            item.requisitoNormativo
              .articulo,
          descripcion:
            item.requisitoNormativo
              .descripcion,
        })
      ) ?? [],
    reglasAprobacion:
      current?.reglasAprobacion?.map(
        (item) => ({
          modalidad: item.modalidad,
          tipoActividad:
            item.tipoActividad,
          criterio: item.criterio,
          requiereAprobacion:
            item.requiereAprobacion,
        })
      ) ?? [],
  };
}
