import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Loader2,
} from "lucide-react";

import AppModal from "../../../components/ui/AppModal";
import AppSelect from "../../../components/ui/AppSelect";

import type {
  ApprovalRulePayload,
  AspectCatalog,
  AspectPayload,
  BaseDateType,
  EvergreenBlock,
  ManagementMode,
  MatrixCatalogs,
  PeriodicitySource,
  PeriodicityUnit,
  RecordStatus,
  RequirementPayload,
} from "../types/supermatriz.types";

interface Props {
  open: boolean;
  current: AspectCatalog | null;
  versionSupermatrizId: number;
  catalogs: MatrixCatalogs;
  onClose: () => void;
  onSave: (
    current: AspectCatalog | null,
    payload: AspectPayload
  ) => Promise<unknown>;
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

function parseRequirements(
  value: string
): RequirementPayload[] {
  return value
    .split("\n")
    .map((line) =>
      line.trim()
    )
    .filter(Boolean)
    .map((line) => {
      const [
        norma,
        articulo,
        descripcion,
      ] = line
        .split("|")
        .map((part) =>
          part.trim()
        );

      return {
        norma,
        articulo:
          articulo || null,
        descripcion:
          descripcion || null,
      };
    })
    .filter(
      (item) =>
        Boolean(item.norma)
    );
}

function parseRules(
  value: string
): ApprovalRulePayload[] {
  return value
    .split("\n")
    .map((line) =>
      line.trim()
    )
    .filter(Boolean)
    .map((line) => {
      const [
        modalidad,
        tipoActividad,
        criterio,
      ] = line
        .split("|")
        .map((part) =>
          part.trim()
        );

      const validModes: ManagementMode[] =
        [
          "PRESENCIAL",
          "REMOTA",
          "OFICINA",
          "SEGUIMIENTO_PUNTUAL",
        ];

      return {
        modalidad:
          validModes.includes(
            modalidad as ManagementMode
          )
            ? (modalidad as ManagementMode)
            : null,
        tipoActividad:
          tipoActividad ||
          null,
        criterio:
          criterio || "",
        requiereAprobacion:
          true,
      };
    })
    .filter(
      (item) =>
        Boolean(item.criterio)
    );
}

export default function AspectEditorModal({
  open,
  current,
  versionSupermatrizId,
  catalogs,
  onClose,
  onSave,
}: Props) {
  const [
    estandarId,
    setEstandarId,
  ] = useState("");
  const [code, setCode] =
    useState("");
  const [name, setName] =
    useState("");
  const [
    description,
    setDescription,
  ] = useState("");
  const [order, setOrder] =
    useState("1");
  const [status, setStatus] =
    useState<RecordStatus>("ACTIVO");
  const [plan, setPlan] =
    useState("");

  const [
    isEvergreen,
    setIsEvergreen,
  ] = useState(false);
  const [
    evergreenBlock,
    setEvergreenBlock,
  ] = useState<
    EvergreenBlock | ""
  >("");
  const [
    periodicDocument,
    setPeriodicDocument,
  ] = useState(false);
  const [
    dailyTask,
    setDailyTask,
  ] = useState(false);
  const [
    includeTaskReport,
    setIncludeTaskReport,
  ] = useState(false);
  const [
    allowsNotApplicable,
    setAllowsNotApplicable,
  ] = useState(true);

  const [
    baseDateType,
    setBaseDateType,
  ] = useState<BaseDateType>(
    "FECHA_DOCUMENTO"
  );
  const [
    periodicitySource,
    setPeriodicitySource,
  ] = useState<PeriodicitySource>(
    "CONFIGURACION_TECNICA"
  );
  const [
    periodicityAmount,
    setPeriodicityAmount,
  ] = useState("12");
  const [
    periodicityUnit,
    setPeriodicityUnit,
  ] = useState<
    PeriodicityUnit | ""
  >("MES");
  const [
    alertDays,
    setAlertDays,
  ] = useState("30");
  const [
    allowsManualDate,
    setAllowsManualDate,
  ] = useState(true);
  const [
    fixedMonth,
    setFixedMonth,
  ] = useState("");
  const [
    fixedDay,
    setFixedDay,
  ] = useState("");
  const [
    validityRule,
    setValidityRule,
  ] = useState("");

  const [
    requiresEvidence,
    setRequiresEvidence,
  ] = useState(false);
  const [
    evidenceDescription,
    setEvidenceDescription,
  ] = useState("");
  const [
    visibleToClient,
    setVisibleToClient,
  ] = useState(false);

  const [
    requiresTechnicalReview,
    setRequiresTechnicalReview,
  ] = useState(false);
  const [
    reviewObservations,
    setReviewObservations,
  ] = useState("");

  const [
    dailyTarget,
    setDailyTarget,
  ] = useState("1");
  const [
    dailyUnit,
    setDailyUnit,
  ] = useState<PeriodicityUnit>(
    "MES"
  );
  const [
    dailyDescription,
    setDailyDescription,
  ] = useState("");

  const [keywords, setKeywords] =
    useState("");
  const [
    requirementsText,
    setRequirementsText,
  ] = useState("");
  const [
    rulesText,
    setRulesText,
  ] = useState("");

  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setEstandarId(
      current
        ? String(
            current.estandarId
          )
        : ""
    );
    setCode(
      current?.codigo ?? ""
    );
    setName(
      current?.nombre ?? ""
    );
    setDescription(
      current?.descripcion ??
        ""
    );
    setOrder(
      String(
        current?.orden ?? 1
      )
    );
    setStatus(
      current?.estado ??
        "ACTIVO"
    );
    setPlan(
      current
        ?.planAccionEspecifico
        ?.descripcion ?? ""
    );

    setIsEvergreen(
      current?.configuracion
        ?.esEvergreen ?? false
    );
    setEvergreenBlock(
      current?.configuracion
        ?.bloqueEvergreen ?? ""
    );
    setPeriodicDocument(
      current?.configuracion
        ?.documentoActualizacionPeriodica ??
        false
    );
    setDailyTask(
      current?.configuracion
        ?.tareaEjecucionCotidiana ??
        false
    );
    setIncludeTaskReport(
      current?.configuracion
        ?.incluirInformeEstadoTareas ??
        false
    );
    setAllowsNotApplicable(
      current?.configuracion
        ?.permiteNoAplica ??
        true
    );

    setBaseDateType(
      current
        ?.configuracionVigencia
        ?.tipoFechaBase ??
        "FECHA_DOCUMENTO"
    );
    setPeriodicitySource(
      current
        ?.configuracionVigencia
        ?.fuentePeriodicidad ??
        "CONFIGURACION_TECNICA"
    );
    setPeriodicityAmount(
      String(
        current
          ?.configuracionVigencia
          ?.cantidad ?? 12
      )
    );
    setPeriodicityUnit(
      current
        ?.configuracionVigencia
        ?.unidad ?? "MES"
    );
    setAlertDays(
      String(
        current
          ?.configuracionVigencia
          ?.diasAlertaPrevia ??
          30
      )
    );
    setAllowsManualDate(
      current
        ?.configuracionVigencia
        ?.permiteFechaManual ??
        true
    );
    setFixedMonth(
      String(
        current
          ?.configuracionVigencia
          ?.mesFechaFija ?? ""
      )
    );
    setFixedDay(
      String(
        current
          ?.configuracionVigencia
          ?.diaFechaFija ?? ""
      )
    );
    setValidityRule(
      current
        ?.configuracionVigencia
        ?.descripcionRegla ??
        ""
    );

    setRequiresEvidence(
      current
        ?.configuracionEvidencia
        ?.requiereEvidencia ??
        false
    );
    setEvidenceDescription(
      current
        ?.configuracionEvidencia
        ?.descripcionEvidencia ??
        ""
    );
    setVisibleToClient(
      current
        ?.configuracionEvidencia
        ?.visibleClienteDefault ??
        false
    );

    setRequiresTechnicalReview(
      current
        ?.configuracionRevision
        ?.requiereRevisionTecnica ??
        false
    );
    setReviewObservations(
      current
        ?.configuracionRevision
        ?.observaciones ?? ""
    );

    setDailyTarget(
      String(
        current
          ?.configuracionTareaCotidiana
          ?.cantidadObjetivo ??
          1
      )
    );
    setDailyUnit(
      current
        ?.configuracionTareaCotidiana
        ?.unidad ?? "MES"
    );
    setDailyDescription(
      current
        ?.configuracionTareaCotidiana
        ?.descripcion ?? ""
    );

    setKeywords(
      current?.palabrasClave
        ?.map(
          (item) =>
            item.palabraClave
              .nombre
        )
        .join(", ") ?? ""
    );

    setRequirementsText(
      current
        ?.requisitosNormativos
        ?.map((item) => {
          const requirement =
            item.requisitoNormativo;

          return [
            requirement.norma,
            requirement.articulo ??
              "",
            requirement.descripcion ??
              "",
          ].join(" | ");
        })
        .join("\n") ?? ""
    );

    setRulesText(
      current?.reglasAprobacion
        ?.map((rule) =>
          [
            rule.modalidad ??
              "",
            rule.tipoActividad ??
              "",
            rule.criterio,
          ].join(" | ")
        )
        .join("\n") ?? ""
    );

    setError(null);
  }, [open, current]);

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave(
        current,
        {
          versionSupermatrizId,
          estandarId:
            Number(estandarId),
          codigo:
            code.trim() || null,
          nombre: name.trim(),
          descripcion:
            description.trim() ||
            null,
          orden: Number(order),
          estado: status,
          planAccionEspecifico:
            plan.trim(),
          configuracion: {
            esEvergreen:
              isEvergreen,
            bloqueEvergreen:
              isEvergreen &&
              evergreenBlock
                ? evergreenBlock
                : null,
            documentoActualizacionPeriodica:
              periodicDocument,
            tareaEjecucionCotidiana:
              dailyTask,
            incluirInformeEstadoTareas:
              includeTaskReport,
            permiteNoAplica:
              allowsNotApplicable,
          },
          configuracionVigencia:
            {
              tipoFechaBase:
                baseDateType,
              fuentePeriodicidad:
                periodicitySource,
              cantidad:
                periodicityUnit &&
                periodicityAmount
                  ? Number(
                      periodicityAmount
                    )
                  : null,
              unidad:
                periodicityUnit ||
                null,
              diasAlertaPrevia:
                Number(
                  alertDays
                ),
              permiteFechaManual:
                allowsManualDate,
              mesFechaFija:
                fixedMonth
                  ? Number(
                      fixedMonth
                    )
                  : null,
              diaFechaFija:
                fixedDay
                  ? Number(
                      fixedDay
                    )
                  : null,
              descripcionRegla:
                validityRule.trim() ||
                null,
            },
          configuracionEvidencia:
            {
              requiereEvidencia:
                requiresEvidence,
              descripcionEvidencia:
                evidenceDescription.trim() ||
                null,
              visibleClienteDefault:
                visibleToClient,
            },
          configuracionRevision:
            {
              requiereRevisionTecnica:
                requiresTechnicalReview,
              observaciones:
                reviewObservations.trim() ||
                null,
            },
          configuracionTareaCotidiana:
            dailyTask
              ? {
                  cantidadObjetivo:
                    Number(
                      dailyTarget
                    ),
                  unidad:
                    dailyUnit,
                  descripcion:
                    dailyDescription.trim() ||
                    null,
                }
              : null,
          palabrasClave:
            keywords
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),
          requisitosNormativos:
            parseRequirements(
              requirementsText
            ),
          reglasAprobacion:
            parseRules(
              rulesText
            ),
        }
      );

      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar el aspecto."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      open={open}
      title={
        current
          ? "Editar aspecto"
          : "Nuevo aspecto"
      }
      description="El aspecto concentra el plan de acción, periodicidad, evidencia, revisión técnica y reglas operativas."
      onClose={onClose}
      busy={saving}
      size="2xl"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="aspect-editor-form"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Guardar aspecto
          </button>
        </div>
      }
    >
      <form
        id="aspect-editor-form"
        onSubmit={submit}
        className="space-y-7"
      >
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Section title="Información general">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Estándar *"
              spanTwo
            >
              <AppSelect
                required
                value={estandarId}
                onChange={(event) =>
                  setEstandarId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Selecciona un estándar
                </option>
                {catalogs.estandares.map(
                  (standard) => (
                    <option
                      key={
                        standard.id
                      }
                      value={
                        standard.id
                      }
                    >
                      {
                        standard
                          .categoriaEstandar
                          .cicloPhva
                          .nombre
                      }{" "}
                      ·{" "}
                      {
                        standard.nombre
                      }
                    </option>
                  )
                )}
              </AppSelect>
            </Field>

            <Field label="Código">
              <input
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Orden *">
              <input
                required
                type="number"
                min={0}
                value={order}
                onChange={(event) =>
                  setOrder(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Nombre *"
              spanTwo
            >
              <input
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Descripción"
              spanTwo
            >
              <textarea
                rows={3}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Plan de acción específico *"
              spanTwo
            >
              <textarea
                required
                rows={4}
                value={plan}
                onChange={(event) =>
                  setPlan(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="Estado">
              <AppSelect
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as RecordStatus
                  )
                }
              >
                <option value="ACTIVO">
                  Activo
                </option>
                <option value="INACTIVO">
                  Inactivo
                </option>
              </AppSelect>
            </Field>
          </div>
        </Section>

        <Section title="Configuración general">
          <div className="grid gap-3 md:grid-cols-2">
            <Check
              label="Es evergreen"
              checked={
                isEvergreen
              }
              onChange={
                setIsEvergreen
              }
            />
            <Check
              label="Documento de actualización periódica"
              checked={
                periodicDocument
              }
              onChange={
                setPeriodicDocument
              }
            />
            <Check
              label="Tarea de ejecución cotidiana"
              checked={dailyTask}
              onChange={
                setDailyTask
              }
            />
            <Check
              label="Incluir en informe de estado de tareas"
              checked={
                includeTaskReport
              }
              onChange={
                setIncludeTaskReport
              }
            />
            <Check
              label="Permite No Aplica"
              checked={
                allowsNotApplicable
              }
              onChange={
                setAllowsNotApplicable
              }
            />
          </div>

          {isEvergreen && (
            <div className="mt-4">
              <Field label="Bloque evergreen">
                <AppSelect
                  value={
                    evergreenBlock
                  }
                  onChange={(event) =>
                    setEvergreenBlock(
                      event.target
                        .value as EvergreenBlock
                    )
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
            </div>
          )}
        </Section>

        <Section title="Periodicidad y vigencia">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Fecha base">
              <AppSelect
                value={baseDateType}
                onChange={(event) =>
                  setBaseDateType(
                    event.target
                      .value as BaseDateType
                  )
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

            <Field label="Fuente">
              <AppSelect
                value={
                  periodicitySource
                }
                onChange={(event) =>
                  setPeriodicitySource(
                    event.target
                      .value as PeriodicitySource
                  )
                }
              >
                <option value="NORMATIVA">
                  Normativa
                </option>
                <option value="DIRECTRIZ_INTERNA">
                  Directriz interna
                </option>
                <option value="CONFIGURACION_TECNICA">
                  Configuración técnica
                </option>
              </AppSelect>
            </Field>

            <Field label="Cantidad">
              <input
                type="number"
                min={1}
                value={
                  periodicityAmount
                }
                onChange={(event) =>
                  setPeriodicityAmount(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Unidad">
              <AppSelect
                value={
                  periodicityUnit
                }
                onChange={(event) =>
                  setPeriodicityUnit(
                    event.target
                      .value as PeriodicityUnit
                  )
                }
              >
                <option value="">
                  Sin periodicidad
                </option>
                <option value="DIA">
                  Día
                </option>
                <option value="SEMANA">
                  Semana
                </option>
                <option value="MES">
                  Mes
                </option>
                <option value="ANIO">
                  Año
                </option>
              </AppSelect>
            </Field>

            <Field label="Días de alerta previa">
              <input
                type="number"
                min={0}
                value={alertDays}
                onChange={(event) =>
                  setAlertDays(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <div className="flex items-end">
              <Check
                label="Permitir fecha manual"
                checked={
                  allowsManualDate
                }
                onChange={
                  setAllowsManualDate
                }
              />
            </div>

            {baseDateType ===
              "FECHA_FIJA_CALENDARIO" && (
              <>
                <Field label="Mes fijo">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={
                      fixedMonth
                    }
                    onChange={(event) =>
                      setFixedMonth(
                        event.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>
                <Field label="Día fijo">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={fixedDay}
                    onChange={(event) =>
                      setFixedDay(
                        event.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>
              </>
            )}

            <Field
              label="Descripción de la regla"
              spanTwo
            >
              <textarea
                rows={3}
                value={validityRule}
                onChange={(event) =>
                  setValidityRule(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </Section>

        {dailyTask && (
          <Section title="Tarea cotidiana">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Cantidad objetivo">
                <input
                  type="number"
                  min={1}
                  value={
                    dailyTarget
                  }
                  onChange={(event) =>
                    setDailyTarget(
                      event.target.value
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </Field>
              <Field label="Unidad">
                <AppSelect
                  value={dailyUnit}
                  onChange={(event) =>
                    setDailyUnit(
                      event.target
                        .value as PeriodicityUnit
                    )
                  }
                >
                  <option value="DIA">
                    Día
                  </option>
                  <option value="SEMANA">
                    Semana
                  </option>
                  <option value="MES">
                    Mes
                  </option>
                  <option value="ANIO">
                    Año
                  </option>
                </AppSelect>
              </Field>
              <Field
                label="Descripción"
                spanTwo
              >
                <textarea
                  rows={2}
                  value={
                    dailyDescription
                  }
                  onChange={(event) =>
                    setDailyDescription(
                      event.target.value
                    )
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
          </Section>
        )}

        <Section title="Evidencia y revisión">
          <div className="grid gap-4 md:grid-cols-2">
            <Check
              label="Requiere evidencia"
              checked={
                requiresEvidence
              }
              onChange={
                setRequiresEvidence
              }
            />
            <Check
              label="Visible para el cliente por defecto"
              checked={
                visibleToClient
              }
              onChange={
                setVisibleToClient
              }
            />
            <Field
              label="Descripción de evidencia"
              spanTwo
            >
              <textarea
                rows={3}
                value={
                  evidenceDescription
                }
                onChange={(event) =>
                  setEvidenceDescription(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Check
              label="Requiere revisión técnica"
              checked={
                requiresTechnicalReview
              }
              onChange={
                setRequiresTechnicalReview
              }
            />
            <Field
              label="Observaciones de revisión"
              spanTwo
            >
              <textarea
                rows={3}
                value={
                  reviewObservations
                }
                onChange={(event) =>
                  setReviewObservations(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </Section>

        <Section title="Palabras clave y normativa">
          <div className="space-y-4">
            <Field label="Palabras clave separadas por comas">
              <input
                value={keywords}
                onChange={(event) =>
                  setKeywords(
                    event.target.value
                  )
                }
                placeholder="matriz, peligros, controles"
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Requisitos normativos — una línea por requisito">
              <textarea
                rows={5}
                value={
                  requirementsText
                }
                onChange={(event) =>
                  setRequirementsText(
                    event.target.value
                  )
                }
                placeholder="Decreto 1072 de 2015 | 2.2.4.6.15 | Identificación de peligros"
                className={`${inputClass} resize-y font-mono text-xs`}
              />
            </Field>

            <Field label="Reglas de aprobación — una línea por regla">
              <textarea
                rows={5}
                value={rulesText}
                onChange={(event) =>
                  setRulesText(
                    event.target.value
                  )
                }
                placeholder="SEGUIMIENTO_PUNTUAL | Actualización de matriz | Requiere validación técnica"
                className={`${inputClass} resize-y font-mono text-xs`}
              />
            </Field>
          </div>
        </Section>
      </form>
    </AppModal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 text-sm font-bold text-white">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  spanTwo = false,
}: {
  label: string;
  children: ReactNode;
  spanTwo?: boolean;
}) {
  return (
    <label
      className={
        spanTwo
          ? "md:col-span-2"
          : ""
      }
    >
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#0b0b0b] px-4 py-3 text-sm text-neutral-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
      />
      {label}
    </label>
  );
}
