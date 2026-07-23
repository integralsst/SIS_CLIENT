import {
  useState,
  type FormEvent,
} from "react";

import AppSelect from "../../../../components/ui/AppSelect";
import type {
  AspectCatalog,
  Standard,
} from "../../types/supermatriz.types";
import {
  Field,
  inputClass,
  QuickEditorShell,
  ToggleButton,
} from "./GuidedRowShared";
import type {
  GuidedRowCatalogActions,
  PeriodPreset,
} from "./guidedRow.types";
import {
  buildAspectPayload,
  detectPeriodPreset,
  errorText,
  periodFromPreset,
  readId,
} from "./guidedRow.utils";

interface Props {
  current: AspectCatalog | null;
  standard: Standard;
  versionSupermatrizId: number;
  suggestedOrder: number;
  onCancel: () => void;
  onSave: GuidedRowCatalogActions["onSaveAspect"];
  onSaved: (id: number) => void;
}

export default function QuickAspectForm({
  current,
  standard,
  versionSupermatrizId,
  suggestedOrder,
  onCancel,
  onSave,
  onSaved,
}: Props) {
  const [code, setCode] = useState(
    current?.codigo ?? ""
  );
  const [name, setName] = useState(
    current?.nombre ?? ""
  );
  const [description, setDescription] =
    useState(current?.descripcion ?? "");
  const [plan, setPlan] = useState(
    current?.planAccionEspecifico
      ?.descripcion ?? ""
  );
  const [order, setOrder] = useState(
    String(current?.orden ?? suggestedOrder)
  );
  const [preset, setPreset] =
    useState<PeriodPreset>(() =>
      detectPeriodPreset(current)
    );
  const [periodTouched, setPeriodTouched] =
    useState(false);
  const [isEvergreen, setIsEvergreen] =
    useState(
      current?.configuracion
        ?.esEvergreen ?? false
    );
  const [periodicDocument, setPeriodicDocument] =
    useState(
      current?.configuracion
        ?.documentoActualizacionPeriodica ??
        false
    );
  const [requiresEvidence, setRequiresEvidence] =
    useState(
      current?.configuracionEvidencia
        ?.requiereEvidencia ?? false
    );
  const [requiresTechnicalReview, setRequiresTechnicalReview] =
    useState(
      current?.configuracionRevision
        ?.requiereRevisionTecnica ?? false
    );
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const currentValidity =
        current?.configuracionVigencia;
      const period =
        !periodTouched &&
        currentValidity?.cantidad &&
        currentValidity.unidad
          ? {
              amount:
                currentValidity.cantidad,
              unit: currentValidity.unidad,
            }
          : periodFromPreset(preset);

      const result = await onSave(
        current,
        buildAspectPayload({
          current,
          versionSupermatrizId,
          standardId: standard.id,
          code,
          name,
          description,
          plan,
          order,
          isEvergreen,
          periodicDocument,
          requiresEvidence,
          requiresTechnicalReview,
          periodAmount: period.amount,
          periodUnit: period.unit,
        })
      );

      onSaved(
        current?.id ?? readId(result)
      );
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <QuickEditorShell
      title={
        current
          ? "Editar aspecto básico"
          : "Crear aspecto"
      }
      description={`Quedará dentro del estándar ${standard.nombre}. La configuración avanzada se puede complementar luego desde la tarjeta de la fila.`}
      saving={saving}
      error={error}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Código">
          <input
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Orden *">
          <input
            required
            type="number"
            min={0}
            value={order}
            onChange={(event) =>
              setOrder(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Nombre *" spanTwo>
          <textarea
            required
            rows={2}
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field
          label="Descripción"
          spanTwo
        >
          <textarea
            rows={2}
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
            rows={3}
            value={plan}
            onChange={(event) =>
              setPlan(event.target.value)
            }
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Periodicidad básica">
          <AppSelect
            value={preset}
            onChange={(event) => {
              setPreset(
                event.target
                  .value as PeriodPreset
              );
              setPeriodTouched(true);
            }}
          >
            <option value="MENSUAL">
              Mensual
            </option>
            <option value="TRIMESTRAL">
              Trimestral
            </option>
            <option value="SEMESTRAL">
              Semestral
            </option>
            <option value="ANUAL">
              Anual
            </option>
            <option value="CADA_3_ANIOS">
              Cada 3 años
            </option>
          </AppSelect>
        </Field>
        <Field
          label="Configuración rápida"
          spanTwo
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <ToggleButton
              label="Seguimiento evergreen"
              checked={isEvergreen}
              onChange={setIsEvergreen}
            />
            <ToggleButton
              label="Documento periódico"
              checked={periodicDocument}
              onChange={setPeriodicDocument}
            />
            <ToggleButton
              label="Requiere evidencia"
              checked={requiresEvidence}
              onChange={setRequiresEvidence}
            />
            <ToggleButton
              label="Revisión técnica"
              checked={
                requiresTechnicalReview
              }
              onChange={
                setRequiresTechnicalReview
              }
            />
          </div>
        </Field>
      </div>
    </QuickEditorShell>
  );
}
