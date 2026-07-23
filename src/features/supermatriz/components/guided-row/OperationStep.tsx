import AppSelect from "../../../../components/ui/AppSelect";
import type {
  RecordStatus,
} from "../../types/supermatriz.types";
import {
  Field,
  inputClass,
} from "./GuidedRowShared";

interface Props {
  code: string;
  order: string;
  execution: string;
  supports: string;
  responsible: string;
  goal: string;
  resources: string;
  status: RecordStatus;
  onCodeChange: (value: string) => void;
  onOrderChange: (value: string) => void;
  onExecutionChange: (value: string) => void;
  onSupportsChange: (value: string) => void;
  onResponsibleChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onResourcesChange: (value: string) => void;
  onStatusChange: (value: RecordStatus) => void;
}

export default function OperationStep({
  code,
  order,
  execution,
  supports,
  responsible,
  goal,
  resources,
  status,
  onCodeChange,
  onOrderChange,
  onExecutionChange,
  onSupportsChange,
  onResponsibleChange,
  onGoalChange,
  onResourcesChange,
  onStatusChange,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs leading-6 text-neutral-400">
        <strong className="text-amber-200">
          Diferencia clave:
        </strong>{" "}
        el plan de acción explica qué debe lograr la empresa; la ejecución explica cómo se desarrolla la actividad en la práctica.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Código de la fila"
          help="Opcional. Sirve para ubicarla rápidamente."
        >
          <input
            value={code}
            onChange={(event) =>
              onCodeChange(event.target.value)
            }
            placeholder="Ejemplo: SM-001"
            className={inputClass}
          />
        </Field>

        <Field
          label="Orden *"
          help="Posición visual dentro de la matriz."
        >
          <input
            required
            type="number"
            min={0}
            value={order}
            onChange={(event) =>
              onOrderChange(event.target.value)
            }
            className={inputClass}
          />
        </Field>

        <Field
          label="Responsable sugerido"
          help="Rol que normalmente lidera la actividad; no asigna una persona automáticamente."
          spanTwo
        >
          <input
            value={responsible}
            onChange={(event) =>
              onResponsibleChange(
                event.target.value
              )
            }
            placeholder="Profesional SST, Gerencia, Gestión Humana…"
            className={inputClass}
          />
        </Field>

        <Field
          label="Ejecución"
          help="Describe el procedimiento o la orientación para desarrollar esta actividad."
          spanTwo
        >
          <textarea
            rows={4}
            value={execution}
            onChange={(event) =>
              onExecutionChange(
                event.target.value
              )
            }
            placeholder="Revisar el documento, validar vigencia, comprobar responsables y registrar hallazgos…"
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Fundamentos y soportes"
          help="Documentos, registros, normas o evidencias que respaldan la actividad."
          spanTwo
        >
          <textarea
            rows={3}
            value={supports}
            onChange={(event) =>
              onSupportsChange(
                event.target.value
              )
            }
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Meta esperada"
          help="Resultado concreto que debería quedar al completar la actividad."
          spanTwo
        >
          <textarea
            rows={3}
            value={goal}
            onChange={(event) =>
              onGoalChange(event.target.value)
            }
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Recursos administrativos"
          help="Tiempo, personal, presupuesto, formatos, software u otros recursos."
          spanTwo
        >
          <textarea
            rows={3}
            value={resources}
            onChange={(event) =>
              onResourcesChange(
                event.target.value
              )
            }
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Estado" spanTwo>
          <AppSelect
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target
                  .value as RecordStatus
              )
            }
          >
            <option value="ACTIVO">
              Activa
            </option>
            <option value="INACTIVO">
              Inactiva
            </option>
          </AppSelect>
        </Field>
      </div>
    </section>
  );
}
