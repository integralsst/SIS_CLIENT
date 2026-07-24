import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Settings2,
} from "lucide-react";
import { useState } from "react";

import AppSelect from "../../../../components/ui/AppSelect";
import type {
  MatrixCatalogs,
  PeriodicityUnit,
} from "../../types/supermatriz.types";
import type {
  BuilderAspectDraft,
  BuilderEntityMode,
} from "../../types/supermatriz.types";
import {
  Field,
  ModeSwitch,
  inputClass,
} from "./ReverseRowShared";


function parseRequirementsText(
  value: string
): BuilderAspectDraft["requisitosNormativos"] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [norma, articulo, descripcion] =
        line
          .split("|")
          .map((item) => item.trim());

      return {
        norma,
        articulo: articulo || null,
        descripcion: descripcion || null,
      };
    })
    .filter((item) => Boolean(item.norma));
}

function requirementsText(
  value: BuilderAspectDraft["requisitosNormativos"]
): string {
  return value
    .map((item) =>
      [
        item.norma,
        item.articulo ?? "",
        item.descripcion ?? "",
      ].join(" | ")
    )
    .join("\n");
}

function parseRulesText(
  value: string
): BuilderAspectDraft["reglasAprobacion"] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [modalidad, tipoActividad, criterio] =
        line
          .split("|")
          .map((item) => item.trim());
      const validModes = [
        "PRESENCIAL",
        "REMOTA",
        "OFICINA",
        "SEGUIMIENTO_PUNTUAL",
      ];

      return {
        modalidad: validModes.includes(modalidad)
          ? (modalidad as BuilderAspectDraft["reglasAprobacion"][number]["modalidad"])
          : null,
        tipoActividad: tipoActividad || null,
        criterio: criterio || "",
        requiereAprobacion: true,
      };
    })
    .filter((item) => Boolean(item.criterio));
}

function rulesText(
  value: BuilderAspectDraft["reglasAprobacion"]
): string {
  return value
    .map((item) =>
      [
        item.modalidad ?? "",
        item.tipoActividad ?? "",
        item.criterio,
      ].join(" | ")
    )
    .join("\n");
}

interface Props {
  catalogs: MatrixCatalogs;
  mode: BuilderEntityMode;
  aspectId: string;
  draft: BuilderAspectDraft;
  onModeChange: (mode: BuilderEntityMode) => void;
  onAspectIdChange: (value: string) => void;
  onDraftChange: (
    patch: Partial<BuilderAspectDraft>
  ) => void;
}

export default function AspectFirstStep({
  catalogs,
  mode,
  aspectId,
  draft,
  onModeChange,
  onAspectIdChange,
  onDraftChange,
}: Props) {
  const [advanced, setAdvanced] =
    useState(false);

  const selected =
    catalogs.aspectos.find(
      (item) => item.id === Number(aspectId)
    ) ?? null;

  function patchConfig(
    patch: Partial<BuilderAspectDraft["configuracion"]>
  ) {
    onDraftChange({
      configuracion: {
        ...draft.configuracion,
        ...patch,
      },
    });
  }

  function patchValidity(
    patch: Partial<
      BuilderAspectDraft["configuracionVigencia"]
    >
  ) {
    onDraftChange({
      configuracionVigencia: {
        ...draft.configuracionVigencia,
        ...patch,
      },
    });
  }

  function patchEvidence(
    patch: Partial<
      BuilderAspectDraft["configuracionEvidencia"]
    >
  ) {
    onDraftChange({
      configuracionEvidencia: {
        ...draft.configuracionEvidencia,
        ...patch,
      },
    });
  }

  function patchReview(
    patch: Partial<
      BuilderAspectDraft["configuracionRevision"]
    >
  ) {
    onDraftChange({
      configuracionRevision: {
        ...draft.configuracionRevision,
        ...patch,
      },
    });
  }

  return (
    <section className="space-y-5">
      <ModeSwitch
        value={mode}
        onChange={onModeChange}
        existingLabel="Seleccionar aspecto existente"
        newLabel="Definir aspecto nuevo"
      />

      {mode === "EXISTENTE" ? (
        <div className="space-y-4">
          <Field
            label="Aspecto existente *"
            help="Al seleccionarlo, su estándar, categoría y ciclo PHVA se cargarán automáticamente en los siguientes pasos."
          >
            <AppSelect
              value={aspectId}
              onChange={(event) =>
                onAspectIdChange(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona un aspecto
              </option>
              {catalogs.aspectos
                .filter(
                  (item) =>
                    item.estado === "ACTIVO"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.codigo
                      ? `${item.codigo} · `
                      : ""}
                    {item.nombre}
                  </option>
                ))}
            </AppSelect>
          </Field>

          {selected && (
            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Aspecto seleccionado
              </p>
              <h3 className="mt-2 text-sm font-semibold leading-6 text-white">
                {selected.nombre}
              </h3>
              <div className="mt-4 rounded-xl border border-neutral-800 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                  Plan de acción específico
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  {selected
                    .planAccionEspecifico
                    ?.descripcion ||
                    "Este aspecto no tiene plan de acción activo."}
                </p>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Ruta actual: {selected.estandar.nombre} · {selected.estandar.categoriaEstandar.nombre} · {selected.estandar.categoriaEstandar.cicloPhva.nombre}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs leading-5 text-neutral-400">
            Este aspecto todavía no se guardará. Se conservará dentro del asistente hasta que completes la fila.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Código">
              <input
                value={draft.codigo ?? ""}
                onChange={(event) =>
                  onDraftChange({
                    codigo:
                      event.target.value || null,
                  })
                }
                placeholder="Ej. AS-001"
                className={inputClass}
              />
            </Field>

            <Field label="Orden *">
              <input
                type="number"
                min={0}
                value={draft.orden}
                onChange={(event) =>
                  onDraftChange({
                    orden: Number(
                      event.target.value
                    ),
                  })
                }
                className={inputClass}
              />
            </Field>

            <Field
              label="Nombre del aspecto *"
              spanTwo
            >
              <input
                value={draft.nombre}
                onChange={(event) =>
                  onDraftChange({
                    nombre: event.target.value,
                  })
                }
                placeholder="Punto exacto que será evaluado"
                className={inputClass}
              />
            </Field>

            <Field
              label="Descripción"
              spanTwo
            >
              <textarea
                rows={3}
                value={draft.descripcion ?? ""}
                onChange={(event) =>
                  onDraftChange({
                    descripcion:
                      event.target.value || null,
                  })
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Plan de acción específico *"
              help="Cada aspecto tiene exactamente un plan de acción. Describe qué debe hacer la empresa para cumplir."
              spanTwo
            >
              <textarea
                rows={4}
                value={
                  draft.planAccionEspecifico
                }
                onChange={(event) =>
                  onDraftChange({
                    planAccionEspecifico:
                      event.target.value,
                  })
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CheckCard
              label="Seguimiento evergreen"
              checked={draft.configuracion.esEvergreen}
              onChange={(checked) =>
                patchConfig({
                  esEvergreen: checked,
                  bloqueEvergreen: checked
                    ? draft.configuracion.bloqueEvergreen
                    : null,
                })
              }
            />
            <CheckCard
              label="Documento periódico"
              checked={draft.configuracion.documentoActualizacionPeriodica}
              onChange={(checked) =>
                patchConfig({
                  documentoActualizacionPeriodica: checked,
                })
              }
            />
            <CheckCard
              label="Permite No Aplica"
              checked={draft.configuracion.permiteNoAplica}
              onChange={(checked) =>
                patchConfig({
                  permiteNoAplica: checked,
                })
              }
            />
            <CheckCard
              label="Tarea de ejecución cotidiana"
              checked={draft.configuracion.tareaEjecucionCotidiana}
              onChange={(checked) => {
                patchConfig({
                  tareaEjecucionCotidiana: checked,
                });
                onDraftChange({
                  configuracionTareaCotidiana: checked
                    ? draft.configuracionTareaCotidiana ?? {
                        cantidadObjetivo: 1,
                        unidad: "MES",
                        descripcion: null,
                      }
                    : null,
                });
              }}
            />
            <CheckCard
              label="Incluir en informe de tareas"
              checked={draft.configuracion.incluirInformeEstadoTareas}
              onChange={(checked) =>
                patchConfig({
                  incluirInformeEstadoTareas: checked,
                })
              }
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setAdvanced((value) => !value)
            }
            className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-[#090909] px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <Settings2 className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs font-semibold text-neutral-300">
                  Configuración avanzada del aspecto
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-600">
                  Periodicidad, evidencia, revisión técnica, normativa y palabras clave.
                </p>
              </div>
            </div>
            {advanced ? (
              <ChevronUp className="h-4 w-4 text-neutral-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            )}
          </button>

          {advanced && (
            <div className="space-y-5 rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CalendarClock className="h-4 w-4 text-cyan-400" />
                Periodicidad y vigencia
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Fecha base">
                  <AppSelect
                    value={
                      draft
                        .configuracionVigencia
                        .tipoFechaBase
                    }
                    onChange={(event) =>
                      patchValidity({
                        tipoFechaBase:
                          event.target
                            .value as BuilderAspectDraft["configuracionVigencia"]["tipoFechaBase"],
                      })
                    }
                  >
                    <option value="FECHA_DOCUMENTO">
                      Fecha del documento
                    </option>
                    <option value="FECHA_ULTIMA_REVISION">
                      Fecha de última revisión
                    </option>
                    <option value="FECHA_FIJA_CALENDARIO">
                      Fecha fija de calendario
                    </option>
                  </AppSelect>
                </Field>

                <Field label="Fuente de periodicidad">
                  <AppSelect
                    value={
                      draft
                        .configuracionVigencia
                        .fuentePeriodicidad
                    }
                    onChange={(event) =>
                      patchValidity({
                        fuentePeriodicidad:
                          event.target
                            .value as BuilderAspectDraft["configuracionVigencia"]["fuentePeriodicidad"],
                      })
                    }
                  >
                    <option value="CONFIGURACION_TECNICA">
                      Configuración técnica
                    </option>
                    <option value="NORMATIVA">
                      Normativa
                    </option>
                    <option value="DIRECTRIZ_INTERNA">
                      Directriz interna
                    </option>
                  </AppSelect>
                </Field>

                <Field label="Cantidad">
                  <input
                    type="number"
                    min={1}
                    value={
                      draft
                        .configuracionVigencia
                        .cantidad ?? ""
                    }
                    onChange={(event) =>
                      patchValidity({
                        cantidad: event.target.value
                          ? Number(
                              event.target.value
                            )
                          : null,
                      })
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Unidad">
                  <AppSelect
                    value={
                      draft
                        .configuracionVigencia
                        .unidad ?? ""
                    }
                    onChange={(event) =>
                      patchValidity({
                        unidad:
                          (event.target.value ||
                            null) as BuilderAspectDraft["configuracionVigencia"]["unidad"],
                      })
                    }
                  >
                    <option value="">
                      Revisión anual por defecto
                    </option>
                    <option value="DIA">Día</option>
                    <option value="SEMANA">
                      Semana
                    </option>
                    <option value="MES">Mes</option>
                    <option value="ANIO">Año</option>
                  </AppSelect>
                </Field>

                <Field label="Días de alerta previa">
                  <input
                    type="number"
                    min={0}
                    value={
                      draft
                        .configuracionVigencia
                        .diasAlertaPrevia
                    }
                    onChange={(event) =>
                      patchValidity({
                        diasAlertaPrevia: Number(
                          event.target.value
                        ),
                      })
                    }
                    className={inputClass}
                  />
                </Field>

                <CheckCard
                  label="Permitir fecha manual"
                  checked={draft.configuracionVigencia.permiteFechaManual}
                  onChange={(checked) =>
                    patchValidity({
                      permiteFechaManual: checked,
                    })
                  }
                />

                {draft.configuracionVigencia.tipoFechaBase ===
                  "FECHA_FIJA_CALENDARIO" && (
                  <>
                    <Field label="Mes fijo">
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={draft.configuracionVigencia.mesFechaFija ?? ""}
                        onChange={(event) =>
                          patchValidity({
                            mesFechaFija: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Día fijo">
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={draft.configuracionVigencia.diaFechaFija ?? ""}
                        onChange={(event) =>
                          patchValidity({
                            diaFechaFija: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>
                  </>
                )}

                {draft.configuracion.esEvergreen && (
                  <Field label="Bloque evergreen">
                    <AppSelect
                      value={
                        draft.configuracion
                          .bloqueEvergreen ?? ""
                      }
                      onChange={(event) =>
                        patchConfig({
                          bloqueEvergreen:
                            (event.target.value ||
                              null) as BuilderAspectDraft["configuracion"]["bloqueEvergreen"],
                        })
                      }
                    >
                      <option value="">
                        Sin bloque
                      </option>
                      <option value="PRIMER_CUATRIMESTRE">
                        Primer cuatrimestre
                      </option>
                      <option value="SEGUNDO_CUATRIMESTRE">
                        Segundo cuatrimestre
                      </option>
                      <option value="TERCER_CUATRIMESTRE">
                        Tercer cuatrimestre
                      </option>
                    </AppSelect>
                  </Field>
                )}
              </div>

              <Field label="Descripción de la regla de vigencia">
                <textarea
                  rows={2}
                  value={draft.configuracionVigencia.descripcionRegla ?? ""}
                  onChange={(event) =>
                    patchValidity({
                      descripcionRegla: event.target.value || null,
                    })
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>

              {draft.configuracion.tareaEjecucionCotidiana &&
                draft.configuracionTareaCotidiana && (
                <div className="grid gap-4 border-t border-neutral-800 pt-5 md:grid-cols-2">
                  <Field label="Cantidad objetivo cotidiana">
                    <input
                      type="number"
                      min={1}
                      value={draft.configuracionTareaCotidiana.cantidadObjetivo}
                      onChange={(event) =>
                        onDraftChange({
                          configuracionTareaCotidiana: {
                            ...draft.configuracionTareaCotidiana!,
                            cantidadObjetivo: Number(event.target.value),
                          },
                        })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Unidad cotidiana">
                    <AppSelect
                      value={draft.configuracionTareaCotidiana.unidad}
                      onChange={(event) =>
                        onDraftChange({
                          configuracionTareaCotidiana: {
                            ...draft.configuracionTareaCotidiana!,
                            unidad: event.target.value as PeriodicityUnit,
                          },
                        })
                      }
                    >
                      <option value="DIA">Día</option>
                      <option value="SEMANA">Semana</option>
                      <option value="MES">Mes</option>
                      <option value="ANIO">Año</option>
                    </AppSelect>
                  </Field>
                  <Field label="Descripción de la tarea cotidiana" spanTwo>
                    <textarea
                      rows={2}
                      value={draft.configuracionTareaCotidiana.descripcion ?? ""}
                      onChange={(event) =>
                        onDraftChange({
                          configuracionTareaCotidiana: {
                            ...draft.configuracionTareaCotidiana!,
                            descripcion: event.target.value || null,
                          },
                        })
                      }
                      className={`${inputClass} resize-y`}
                    />
                  </Field>
                </div>
              )}

              <div className="border-t border-neutral-800 pt-5">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-white">
                  <FileCheck2 className="h-4 w-4 text-cyan-400" />
                  Evidencia y revisión técnica
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <CheckCard
                    label="Requiere evidencia"
                    checked={
                      draft
                        .configuracionEvidencia
                        .requiereEvidencia
                    }
                    onChange={(checked) =>
                      patchEvidence({
                        requiereEvidencia: checked,
                      })
                    }
                  />
                  <CheckCard
                    label="Visible al cliente por defecto"
                    checked={draft.configuracionEvidencia.visibleClienteDefault}
                    onChange={(checked) =>
                      patchEvidence({
                        visibleClienteDefault: checked,
                      })
                    }
                  />
                  <CheckCard
                    label="Requiere revisión técnica"
                    checked={
                      draft
                        .configuracionRevision
                        .requiereRevisionTecnica
                    }
                    onChange={(checked) =>
                      patchReview({
                        requiereRevisionTecnica:
                          checked,
                      })
                    }
                  />
                  <Field
                    label="Descripción de evidencia"
                    spanTwo
                  >
                    <textarea
                      rows={2}
                      value={
                        draft
                          .configuracionEvidencia
                          .descripcionEvidencia ??
                        ""
                      }
                      onChange={(event) =>
                        patchEvidence({
                          descripcionEvidencia:
                            event.target.value ||
                            null,
                        })
                      }
                      className={`${inputClass} resize-y`}
                    />
                  </Field>
                  <Field
                    label="Observaciones de revisión"
                    spanTwo
                  >
                    <textarea
                      rows={2}
                      value={
                        draft
                          .configuracionRevision
                          .observaciones ?? ""
                      }
                      onChange={(event) =>
                        patchReview({
                          observaciones:
                            event.target.value ||
                            null,
                        })
                      }
                      className={`${inputClass} resize-y`}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-5">
                <div className="grid gap-4">
                  <Field label="Palabras clave separadas por comas">
                    <input
                      value={
                        draft.palabrasClave.join(
                          ", "
                        )
                      }
                      onChange={(event) =>
                        onDraftChange({
                          palabrasClave:
                            event.target.value
                              .split(",")
                              .map((item) =>
                                item.trim()
                              )
                              .filter(Boolean),
                        })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Requisitos normativos — una línea por requisito">
                    <textarea
                      rows={4}
                      value={requirementsText(draft.requisitosNormativos)}
                      onChange={(event) =>
                        onDraftChange({
                          requisitosNormativos: parseRequirementsText(
                            event.target.value
                          ),
                        })
                      }
                      placeholder="Decreto 1072 de 2015 | 2.2.4.6.15 | Identificación de peligros"
                      className={`${inputClass} resize-y font-mono text-xs`}
                    />
                  </Field>
                  <Field label="Reglas de aprobación — una línea por regla">
                    <textarea
                      rows={4}
                      value={rulesText(draft.reglasAprobacion)}
                      onChange={(event) =>
                        onDraftChange({
                          reglasAprobacion: parseRulesText(
                            event.target.value
                          ),
                        })
                      }
                      placeholder="SEGUIMIENTO_PUNTUAL | Actualización de matriz | Requiere validación técnica"
                      className={`${inputClass} resize-y font-mono text-xs`}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function CheckCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${
        checked
          ? "border-cyan-500/25 bg-cyan-500/10"
          : "border-neutral-800 bg-[#090909]"
      }`}
    >
      <span className="text-xs font-medium text-neutral-300">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
      />
    </label>
  );
}
