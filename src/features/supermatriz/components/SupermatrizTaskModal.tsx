import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers3,
  Loader2,
  Route,
  Save,
  Wrench,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import AppModal from "../../../components/ui/AppModal";
import AppSelect from "../../../components/ui/AppSelect";

import type {
  MatrixCatalogs,
  MatrixTask,
  MatrixTaskPayload,
  RecordStatus,
} from "../types/supermatriz.types";

interface Props {
  open: boolean;
  task: MatrixTask | null;
  catalogs: MatrixCatalogs;
  versionSupermatrizId: number;
  initialProcessId?: number | null;
  onClose: () => void;
  onSave: (payload: MatrixTaskPayload) => Promise<unknown>;
}

type Step = 1 | 2 | 3 | 4;

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

const steps: Array<{
  id: Step;
  title: string;
  short: string;
  explanation: string;
  icon: typeof Route;
}> = [
  {
    id: 1,
    title: "Conectar la fila",
    short: "Relación",
    explanation: "Selecciona el aspecto que se revisará y el proceso mediante el cual se trabajará.",
    icon: Route,
  },
  {
    id: 2,
    title: "Explicar cómo se trabaja",
    short: "Ejecución",
    explanation: "Describe la ejecución, los soportes, el responsable, la meta y los recursos.",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Clasificar la gestión",
    short: "Gestión",
    explanation: "Indica qué tipo de equipo o servicio debe atender esta fila.",
    icon: Layers3,
  },
  {
    id: 4,
    title: "Revisar y guardar",
    short: "Confirmar",
    explanation: "Confirma la información completa antes de crear o actualizar la fila.",
    icon: ClipboardCheck,
  },
];

export default function SupermatrizTaskModal({
  open,
  task,
  catalogs,
  versionSupermatrizId,
  initialProcessId = null,
  onClose,
  onSave,
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [aspectId, setAspectId] = useState("");
  const [processId, setProcessId] = useState("");
  const [code, setCode] = useState("");
  const [order, setOrder] = useState("1");
  const [execution, setExecution] = useState("");
  const [supports, setSupports] = useState("");
  const [responsible, setResponsible] = useState("");
  const [goal, setGoal] = useState("");
  const [resources, setResources] = useState("");
  const [status, setStatus] = useState<RecordStatus>("ACTIVO");
  const [managementCategoryIds, setManagementCategoryIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    setStep(1);
    setAspectId(task ? String(task.aspectoId) : "");
    setProcessId(
      task
        ? String(task.procesoId)
        : initialProcessId
          ? String(initialProcessId)
          : ""
    );
    setCode(task?.codigo ?? "");
    setOrder(String(task?.orden ?? 1));
    setExecution(task?.ejecucion ?? "");
    setSupports(task?.fundamentosSoportes ?? "");
    setResponsible(task?.responsableActividad ?? "");
    setGoal(task?.metasEstandar ?? "");
    setResources(task?.recursosAdministrativos ?? "");
    setStatus(task?.estado ?? "ACTIVO");
    setManagementCategoryIds(
      task?.categoriasGestion.map((item) => item.categoriaGestionId) ?? []
    );
    submitLockRef.current = false;
    setSaving(false);
    setError(null);
  }, [open, task, initialProcessId]);

  const selectedAspect = useMemo(
    () =>
      catalogs.aspectos.find((item) => item.id === Number(aspectId)) ?? null,
    [catalogs.aspectos, aspectId]
  );

  const selectedProcess = useMemo(
    () =>
      catalogs.procesos.find((item) => item.id === Number(processId)) ?? null,
    [catalogs.procesos, processId]
  );

  const selectedCategories = useMemo(
    () =>
      catalogs.categoriasGestion.filter((item) =>
        managementCategoryIds.includes(item.id)
      ),
    [catalogs.categoriasGestion, managementCategoryIds]
  );

  const completion = useMemo(() => {
    const checks = [
      Boolean(processId),
      Boolean(aspectId),
      Number.isInteger(Number(order)) && Number(order) >= 0,
      managementCategoryIds.length > 0,
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [processId, aspectId, order, managementCategoryIds]);

  function toggleCategory(id: number) {
    setManagementCategoryIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
    setError(null);
  }

  function validateStep(currentStep: Step): string | null {
    if (currentStep === 1) {
      if (!processId) return "Selecciona el proceso que utilizará esta fila.";
      if (!aspectId) return "Selecciona el aspecto que se revisará.";

      if (!selectedProcess || selectedProcess.estado !== "ACTIVO") {
        return "El proceso seleccionado no está activo o no pertenece a esta versión.";
      }

      if (!selectedAspect || selectedAspect.estado !== "ACTIVO") {
        return "El aspecto seleccionado no está activo o no pertenece a esta versión.";
      }
    }

    if (currentStep === 2) {
      const numericOrder = Number(order);
      if (!Number.isInteger(numericOrder) || numericOrder < 0) {
        return "El orden debe ser un número entero igual o mayor que cero.";
      }
    }

    if (currentStep === 3 && managementCategoryIds.length === 0) {
      return "Selecciona al menos una categoría de gestión. Esta clasificación es obligatoria.";
    }

    return null;
  }

  function goNext() {
    const validationError = validateStep(step);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStep((current) => Math.min(4, current + 1) as Step);
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1) as Step);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || submitLockRef.current) {
      return;
    }

    for (const stepToValidate of [1, 2, 3] as Step[]) {
      const validationError = validateStep(stepToValidate);
      if (validationError) {
        setStep(stepToValidate);
        setError(validationError);
        return;
      }
    }

    submitLockRef.current = true;
    setSaving(true);
    setError(null);

    try {
      const result = await onSave({
        versionSupermatrizId,
        aspectoId: Number(aspectId),
        procesoId: Number(processId),
        codigo: code.trim() || null,
        orden: Number(order),
        ejecucion: execution.trim() || null,
        fundamentosSoportes: supports.trim() || null,
        responsableActividad: responsible.trim() || null,
        metasEstandar: goal.trim() || null,
        recursosAdministrativos: resources.trim() || null,
        estado: status,
        categoriaGestionIds: managementCategoryIds,
      });

      if (
        result &&
        typeof result === "object" &&
        "error" in result &&
        typeof result.error === "string"
      ) {
        throw new Error(result.error);
      }

      onClose();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar la fila.";

      if (
        message.toLowerCase().includes("ya existe una fila") ||
        message.toLowerCase().includes("relaciona este aspecto con este proceso")
      ) {
        setStep(1);
      }

      setError(message);
    } finally {
      submitLockRef.current = false;
      setSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title={task ? "Editar fila de la Supermatriz" : "Nueva fila de la Supermatriz"}
      description="Te guiaremos paso a paso. Una fila conecta un aspecto con un proceso y explica cómo debe trabajarse."
      onClose={onClose}
      busy={saving}
      size="2xl"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">Completitud</span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-cyan-400">{completion}%</span>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={goBack}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300"
              >
                <ArrowLeft size={16} />
                Anterior
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black"
              >
                Continuar
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                form="supermatriz-task-form"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {task ? "Guardar cambios" : "Crear fila"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <form id="supermatriz-task-form" onSubmit={submit} className="space-y-6">
        <StepNavigator currentStep={step} onSelect={setStep} />

        <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4">
          <div className="flex items-start gap-3">
            {(() => {
              const Icon = steps[step - 1].icon;
              return (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <Icon size={18} />
                </div>
              );
            })()}
            <div>
              <p className="text-sm font-bold text-white">{steps[step - 1].title}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {steps[step - 1].explanation}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
            <strong className="block text-red-200">No se puede continuar todavía</strong>
            {error}
          </div>
        )}

        {step === 1 && (
          <RelationStep
            catalogs={catalogs}
            processId={processId}
            aspectId={aspectId}
            selectedProcess={selectedProcess}
            selectedAspect={selectedAspect}
            onProcessChange={(value) => {
              setProcessId(value);
              setError(null);
            }}
            onAspectChange={(value) => {
              setAspectId(value);
              setError(null);
            }}
          />
        )}

        {step === 2 && (
          <ExecutionStep
            code={code}
            order={order}
            responsible={responsible}
            execution={execution}
            supports={supports}
            goal={goal}
            resources={resources}
            status={status}
            onCodeChange={setCode}
            onOrderChange={setOrder}
            onResponsibleChange={setResponsible}
            onExecutionChange={setExecution}
            onSupportsChange={setSupports}
            onGoalChange={setGoal}
            onResourcesChange={setResources}
            onStatusChange={setStatus}
          />
        )}

        {step === 3 && (
          <ManagementStep
            catalogs={catalogs}
            selectedIds={managementCategoryIds}
            onToggle={toggleCategory}
          />
        )}

        {step === 4 && (
          <ReviewStep
            code={code}
            order={order}
            selectedProcess={selectedProcess}
            selectedAspect={selectedAspect}
            selectedCategories={selectedCategories}
            execution={execution}
            supports={supports}
            responsible={responsible}
            goal={goal}
            resources={resources}
            status={status}
          />
        )}
      </form>
    </AppModal>
  );
}

function StepNavigator({
  currentStep,
  onSelect,
}: {
  currentStep: Step;
  onSelect: (step: Step) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {steps.map((item) => {
        const Icon = item.icon;
        const active = currentStep === item.id;
        const completed = currentStep > item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id <= currentStep) onSelect(item.id);
            }}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
              active
                ? "border-cyan-500/30 bg-cyan-500/10"
                : completed
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-neutral-800 bg-[#090909]"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                completed
                  ? "bg-emerald-500/10 text-emerald-400"
                  : active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "bg-neutral-800 text-neutral-600"
              }`}
            >
              {completed ? <CheckCircle2 size={16} /> : <Icon size={16} />}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                Paso {item.id}
              </p>
              <p className={`truncate text-xs font-medium ${active ? "text-cyan-200" : "text-neutral-400"}`}>
                {item.short}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function RelationStep({
  catalogs,
  processId,
  aspectId,
  selectedProcess,
  selectedAspect,
  onProcessChange,
  onAspectChange,
}: {
  catalogs: MatrixCatalogs;
  processId: string;
  aspectId: string;
  selectedProcess: MatrixCatalogs["procesos"][number] | null;
  selectedAspect: MatrixCatalogs["aspectos"][number] | null;
  onProcessChange: (value: string) => void;
  onAspectChange: (value: string) => void;
}) {
  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Proceso *"
          help="El proceso indica desde qué actividad o área se trabajará el aspecto. Un proceso puede usarse en muchas filas."
        >
          <AppSelect
            required
            value={processId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onProcessChange(event.target.value)}
          >
            <option value="">Selecciona un proceso</option>
            {catalogs.procesos
              .filter((item) => item.estado === "ACTIVO")
              .map((process) => (
                <option key={process.id} value={process.id}>
                  {process.codigo ? `${process.codigo} · ` : ""}
                  {process.nombre}
                </option>
              ))}
          </AppSelect>
        </Field>

        <Field
          label="Aspecto *"
          help="El aspecto es el punto exacto que después será evaluado en cada empresa. Ya trae su estándar, categoría y ciclo PHVA."
        >
          <AppSelect
            required
            value={aspectId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onAspectChange(event.target.value)}
          >
            <option value="">Selecciona un aspecto</option>
            {catalogs.aspectos
              .filter((item) => item.estado === "ACTIVO")
              .map((aspect) => (
                <option key={aspect.id} value={aspect.id}>
                  {aspect.codigo ? `${aspect.codigo} · ` : ""}
                  {aspect.nombre}
                </option>
              ))}
          </AppSelect>
        </Field>
      </div>

      {selectedProcess && (
        <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
            Proceso seleccionado
          </p>
          <p className="mt-2 font-semibold text-white">{selectedProcess.nombre}</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {selectedProcess.descripcion ||
              "Este proceso todavía no tiene una descripción. Puedes agregarla desde la pestaña Procesos."}
          </p>
        </div>
      )}

      {selectedAspect && (
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            Contexto automático del aspecto
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ContextItem
              label="Ciclo PHVA"
              value={selectedAspect.estandar.categoriaEstandar.cicloPhva.nombre}
            />
            <ContextItem
              label="Categoría"
              value={selectedAspect.estandar.categoriaEstandar.nombre}
            />
            <ContextItem label="Estándar" value={selectedAspect.estandar.nombre} />
            <ContextItem label="Aspecto" value={selectedAspect.nombre} />
          </div>
          <div className="mt-4 rounded-xl border border-cyan-500/10 bg-black/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/80">
              Plan de acción específico
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-200">
              {selectedAspect.planAccionEspecifico?.descripcion ||
                "Este aspecto no tiene un plan de acción activo. Debes configurarlo antes de guardar la fila."}
            </p>
          </div>
        </div>
      )}

      <LearningTip>
        No estás asignando una “fila” al proceso desde la pestaña Procesos. Aquí estás
        creando la fila y eligiendo qué proceso utilizará. El contador de filas del
        proceso se actualizará automáticamente después de guardar.
      </LearningTip>
    </section>
  );
}

function ExecutionStep({
  code,
  order,
  responsible,
  execution,
  supports,
  goal,
  resources,
  status,
  onCodeChange,
  onOrderChange,
  onResponsibleChange,
  onExecutionChange,
  onSupportsChange,
  onGoalChange,
  onResourcesChange,
  onStatusChange,
}: {
  code: string;
  order: string;
  responsible: string;
  execution: string;
  supports: string;
  goal: string;
  resources: string;
  status: RecordStatus;
  onCodeChange: (value: string) => void;
  onOrderChange: (value: string) => void;
  onResponsibleChange: (value: string) => void;
  onExecutionChange: (value: string) => void;
  onSupportsChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onResourcesChange: (value: string) => void;
  onStatusChange: (value: RecordStatus) => void;
}) {
  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-sm leading-6 text-neutral-300">
        <strong className="text-amber-200">Diferencia importante:</strong> el plan de
        acción dice <em>qué debe hacer la empresa</em>; el campo Ejecución explica
        <em> cómo se desarrolla la actividad en la práctica</em>.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Código"
          help="Identificador corto para encontrar la fila. Es opcional, pero recomendado. Ejemplo: SM-001."
        >
          <input
            value={code}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onCodeChange(event.target.value)}
            placeholder="Ejemplo: SM-001"
            className={inputClass}
          />
        </Field>

        <Field
          label="Orden *"
          help="Posición en la que aparecerá la fila dentro de la matriz. No es el contador de procesos."
        >
          <input
            required
            type="number"
            min={0}
            value={order}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onOrderChange(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          label="Responsable sugerido"
          help="Rol que normalmente debería liderar la actividad. No asigna automáticamente una persona."
          spanTwo
        >
          <input
            value={responsible}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onResponsibleChange(event.target.value)}
            placeholder="Ejemplo: Profesional SST, Gerencia o Talento Humano"
            className={inputClass}
          />
        </Field>

        <Field
          label="Ejecución"
          help="Explica paso a paso cómo desarrollar esta actividad. Este campo aparecerá en la vista detallada de la fila."
          spanTwo
        >
          <textarea
            rows={5}
            value={execution}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onExecutionChange(event.target.value)}
            placeholder="Ejemplo: revisar el documento, validar responsables, comprobar vigencia y registrar hallazgos..."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Fundamentos y soportes"
          help="Documentos, registros, normas o evidencias que respaldan la ejecución."
          spanTwo
        >
          <textarea
            rows={4}
            value={supports}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onSupportsChange(event.target.value)}
            placeholder="Ejemplo: acta, matriz, certificado, procedimiento, fotografías o registros de asistencia..."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Meta esperada"
          help="Resultado concreto que se espera obtener al trabajar la fila."
          spanTwo
        >
          <textarea
            rows={3}
            value={goal}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onGoalChange(event.target.value)}
            placeholder="Ejemplo: contar con el documento actualizado, aprobado y comunicado."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Recursos administrativos"
          help="Tiempo, personal, presupuesto, formatos, software u otros recursos necesarios."
          spanTwo
        >
          <textarea
            rows={3}
            value={resources}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onResourcesChange(event.target.value)}
            placeholder="Ejemplo: disponibilidad de gerencia, presupuesto, acceso a documentos y apoyo del equipo."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field
          label="Estado"
          help="Activo significa que la fila se utilizará. Inactivo la conserva, pero la retira del uso normal."
          spanTwo
        >
          <AppSelect
            value={status}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onStatusChange(event.target.value as RecordStatus)}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </AppSelect>
        </Field>
      </div>
    </section>
  );
}

function ManagementStep({
  catalogs,
  selectedIds,
  onToggle,
}: {
  catalogs: MatrixCatalogs;
  selectedIds: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-sm leading-6 text-neutral-300">
        Selecciona por lo menos una categoría. Esto indica qué tipo de gestión y qué
        equipo deberá atender la fila. Una fila puede pertenecer a varias categorías.
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {catalogs.categoriasGestion
          .filter((category) => category.estado === "ACTIVO")
          .map((category) => {
            const checked = selectedIds.includes(category.id);

            return (
              <label
                key={category.id}
                className={`cursor-pointer rounded-2xl border p-5 transition-colors ${
                  checked
                    ? "border-cyan-500/30 bg-cyan-500/10"
                    : "border-neutral-800 bg-[#090909] hover:border-neutral-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-black/30 text-cyan-400">
                    <Layers3 size={18} />
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(category.id)}
                    className="mt-1 h-4 w-4 accent-cyan-500"
                  />
                </div>
                <p className="mt-4 font-semibold text-white">{category.nombre}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  {category.descripcion || defaultManagementDescription(category.codigo)}
                </p>
                <p className={`mt-4 text-xs font-semibold ${checked ? "text-cyan-300" : "text-neutral-600"}`}>
                  {checked ? "Seleccionada" : "Haz clic para seleccionar"}
                </p>
              </label>
            );
          })}
      </div>

      {selectedIds.length === 0 ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Todavía no has seleccionado ninguna categoría de gestión. No podrás guardar la fila hasta elegir al menos una.
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 size={17} />
          {selectedIds.length} categoría(s) seleccionada(s).
        </div>
      )}
    </section>
  );
}

function ReviewStep({
  code,
  order,
  selectedProcess,
  selectedAspect,
  selectedCategories,
  execution,
  supports,
  responsible,
  goal,
  resources,
  status,
}: {
  code: string;
  order: string;
  selectedProcess: MatrixCatalogs["procesos"][number] | null;
  selectedAspect: MatrixCatalogs["aspectos"][number] | null;
  selectedCategories: MatrixCatalogs["categoriasGestion"];
  execution: string;
  supports: string;
  responsible: string;
  goal: string;
  resources: string;
  status: RecordStatus;
}) {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold text-white">La fila está lista para guardar</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Revisa el resumen. Puedes volver a los pasos anteriores para corregir cualquier dato.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewCard title="Identificación">
          <ReviewItem label="Código" value={code.trim() || "Se generará sin código visible"} />
          <ReviewItem label="Orden" value={order} />
          <ReviewItem label="Estado" value={status === "ACTIVO" ? "Activo" : "Inactivo"} />
        </ReviewCard>

        <ReviewCard title="Relación maestra">
          <ReviewItem label="Proceso" value={selectedProcess?.nombre || "Sin proceso"} />
          <ReviewItem label="Aspecto" value={selectedAspect?.nombre || "Sin aspecto"} />
          <ReviewItem label="Estándar" value={selectedAspect?.estandar.nombre || "Sin estándar"} />
          <ReviewItem
            label="Ciclo PHVA"
            value={selectedAspect?.estandar.categoriaEstandar.cicloPhva.nombre || "Sin ciclo"}
          />
        </ReviewCard>

        <ReviewCard title="Cómo se trabajará">
          <ReviewItem label="Responsable sugerido" value={responsible || "No definido"} />
          <ReviewItem label="Ejecución" value={execution || "No descrita"} multiline />
          <ReviewItem label="Soportes" value={supports || "No definidos"} multiline />
        </ReviewCard>

        <ReviewCard title="Resultado y recursos">
          <ReviewItem label="Meta" value={goal || "No definida"} multiline />
          <ReviewItem label="Recursos" value={resources || "No definidos"} multiline />
          <ReviewItem
            label="Categorías de gestión"
            value={selectedCategories.map((item) => item.nombre).join(", ") || "Ninguna"}
          />
        </ReviewCard>
      </div>

      <LearningTip>
        Después de guardar podrás abrir el ícono de ojo en la tabla para ver la ficha completa: ruta PHVA, estándar, aspecto, proceso, ejecución, soportes, vigencia, evidencia, normativa y trazabilidad.
      </LearningTip>
    </section>
  );
}

function Field({
  label,
  help,
  children,
  spanTwo = false,
}: {
  label: string;
  help?: string;
  children: ReactNode;
  spanTwo?: boolean;
}) {
  return (
    <label className={spanTwo ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-xs font-medium text-neutral-400">{label}</span>
      {children}
      {help && <span className="mt-2 block text-[11px] leading-5 text-neutral-600">{help}</span>}
    </label>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-black/20 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/70">{label}</p>
      <p className="mt-1 text-xs font-medium leading-5 text-white">{value}</p>
    </div>
  );
}

function LearningTip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-[#090909] p-4">
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
      <p className="text-xs leading-6 text-neutral-400">{children}</p>
    </div>
  );
}

function ReviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#090909] p-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-cyan-400">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="border-b border-neutral-800/70 pb-3 last:border-b-0 last:pb-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">{label}</p>
      <p className={`mt-1 text-sm leading-6 text-neutral-200 ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function defaultManagementDescription(code: string): string {
  if (code === "DOCUMENTAL") {
    return "Revisión, elaboración, actualización y custodia de documentos y evidencias.";
  }

  if (code === "INTERVENCION") {
    return "Actividades en campo, capacitaciones, inspecciones, mediciones o acompañamientos.";
  }

  return "Preparación, prevención y respuesta ante emergencias, brigadas y simulacros.";
}
