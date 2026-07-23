import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Save,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import AppModal from "../../../components/ui/AppModal";
import type {
  MatrixCatalogs,
  MatrixTask,
  MatrixTaskPayload,
  RecordStatus,
} from "../types/supermatriz.types";
import AspectStep from "./guided-row/AspectStep";
import ConfirmationStep from "./guided-row/ConfirmationStep";
import {
  StepIntro,
  StepNavigator,
} from "./guided-row/GuidedRowShared";
import type {
  GuidedRowCatalogActions,
  GuidedRowStep,
  InlineEditorKind,
} from "./guided-row/guidedRow.types";
import OperationStep from "./guided-row/OperationStep";
import ProcessStep from "./guided-row/ProcessStep";
import RouteStep from "./guided-row/RouteStep";

interface Props extends GuidedRowCatalogActions {
  open: boolean;
  task: MatrixTask | null;
  catalogs: MatrixCatalogs;
  versionSupermatrizId: number;
  initialProcessId?: number | null;
  onClose: () => void;
  onSaveTask: (
    payload: MatrixTaskPayload
  ) => Promise<unknown>;
}

export default function SupermatrizTaskModal({
  open,
  task,
  catalogs,
  versionSupermatrizId,
  initialProcessId = null,
  onClose,
  onSaveTask,
  onSaveCycle,
  onSaveCategory,
  onSaveStandard,
  onSaveAspect,
  onSaveProcess,
}: Props) {
  const [step, setStep] =
    useState<GuidedRowStep>(1);
  const [cycleId, setCycleId] =
    useState("");
  const [categoryId, setCategoryId] =
    useState("");
  const [standardId, setStandardId] =
    useState("");
  const [aspectId, setAspectId] =
    useState("");
  const [processId, setProcessId] =
    useState("");
  const [code, setCode] =
    useState("");
  const [order, setOrder] =
    useState("1");
  const [execution, setExecution] =
    useState("");
  const [supports, setSupports] =
    useState("");
  const [responsible, setResponsible] =
    useState("");
  const [goal, setGoal] =
    useState("");
  const [resources, setResources] =
    useState("");
  const [status, setStatus] =
    useState<RecordStatus>("ACTIVO");
  const [managementCategoryIds, setManagementCategoryIds] =
    useState<number[]>([]);
  const [editorKind, setEditorKind] =
    useState<InlineEditorKind | null>(null);
  const [editingExisting, setEditingExisting] =
    useState(false);
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const currentAspect = task?.aspecto;
    const currentStandard =
      currentAspect?.estandar;
    const currentCategory =
      currentStandard?.categoriaEstandar;
    const currentCycle =
      currentCategory?.cicloPhva;

    setStep(1);
    setCycleId(
      currentCycle
        ? String(currentCycle.id)
        : ""
    );
    setCategoryId(
      currentCategory
        ? String(currentCategory.id)
        : ""
    );
    setStandardId(
      currentStandard
        ? String(currentStandard.id)
        : ""
    );
    setAspectId(
      currentAspect
        ? String(currentAspect.id)
        : ""
    );
    setProcessId(
      task
        ? String(task.procesoId)
        : initialProcessId
          ? String(initialProcessId)
          : ""
    );
    setCode(task?.codigo ?? "");
    setOrder(
      String(task?.orden ?? 1)
    );
    setExecution(task?.ejecucion ?? "");
    setSupports(
      task?.fundamentosSoportes ?? ""
    );
    setResponsible(
      task?.responsableActividad ?? ""
    );
    setGoal(task?.metasEstandar ?? "");
    setResources(
      task?.recursosAdministrativos ?? ""
    );
    setStatus(task?.estado ?? "ACTIVO");
    setManagementCategoryIds(
      task?.categoriasGestion.map(
        (item) =>
          item.categoriaGestionId
      ) ?? []
    );
    setEditorKind(null);
    setEditingExisting(false);
    setSaving(false);
    setError(null);
    submitLockRef.current = false;
  }, [open, task, initialProcessId]);

  const categories = useMemo(
    () =>
      catalogs.categoriasEstandar.filter(
        (item) =>
          item.estado === "ACTIVO" &&
          (!cycleId ||
            item.cicloPhvaId ===
              Number(cycleId))
      ),
    [
      catalogs.categoriasEstandar,
      cycleId,
    ]
  );

  const standards = useMemo(
    () =>
      catalogs.estandares.filter(
        (item) =>
          item.estado === "ACTIVO" &&
          (!categoryId ||
            item.categoriaEstandarId ===
              Number(categoryId))
      ),
    [catalogs.estandares, categoryId]
  );

  const aspects = useMemo(
    () =>
      catalogs.aspectos.filter(
        (item) =>
          item.estado === "ACTIVO" &&
          (!standardId ||
            item.estandarId ===
              Number(standardId))
      ),
    [catalogs.aspectos, standardId]
  );

  const selectedCycle = findById(
    catalogs.ciclosPhva,
    cycleId
  );
  const selectedCategory = findById(
    catalogs.categoriasEstandar,
    categoryId
  );
  const selectedStandard = findById(
    catalogs.estandares,
    standardId
  );
  const selectedAspect = findById(
    catalogs.aspectos,
    aspectId
  );
  const selectedProcess = findById(
    catalogs.procesos,
    processId
  );
  const selectedManagementCategories =
    catalogs.categoriasGestion.filter(
      (item) =>
        managementCategoryIds.includes(
          item.id
        )
    );

  const completion = useMemo(() => {
    const checks = [
      Boolean(cycleId),
      Boolean(categoryId),
      Boolean(standardId),
      Boolean(aspectId),
      Boolean(processId),
      Number.isInteger(Number(order)) &&
        Number(order) >= 0,
      managementCategoryIds.length > 0,
    ];

    return Math.round(
      (checks.filter(Boolean).length /
        checks.length) *
        100
    );
  }, [
    aspectId,
    categoryId,
    cycleId,
    managementCategoryIds,
    order,
    processId,
    standardId,
  ]);

  function closeEditor() {
    setEditorKind(null);
    setEditingExisting(false);
  }

  function openEditor(
    kind: InlineEditorKind,
    edit = false
  ) {
    setEditorKind(kind);
    setEditingExisting(edit);
    setError(null);
  }

  function changeCycle(value: string) {
    setCycleId(value);
    setCategoryId("");
    setStandardId("");
    setAspectId("");
    closeEditor();
    setError(null);
  }

  function changeCategory(value: string) {
    setCategoryId(value);
    setStandardId("");
    setAspectId("");
    closeEditor();
    setError(null);
  }

  function changeStandard(value: string) {
    setStandardId(value);
    setAspectId("");
    closeEditor();
    setError(null);
  }

  function toggleManagementCategory(
    id: number
  ) {
    setManagementCategoryIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
    setError(null);
  }

  function validateStep(
    currentStep: GuidedRowStep
  ): string | null {
    if (currentStep === 1) {
      if (!cycleId) {
        return "Selecciona o crea un ciclo PHVA.";
      }
      if (!categoryId) {
        return "Selecciona o crea una categoría para el ciclo.";
      }
      if (!standardId) {
        return "Selecciona o crea un estándar para la categoría.";
      }
    }

    if (currentStep === 2) {
      if (!aspectId) {
        return "Selecciona o crea el aspecto que se evaluará.";
      }
      if (
        !selectedAspect
          ?.planAccionEspecifico
          ?.descripcion
      ) {
        return "El aspecto debe tener un plan de acción específico antes de continuar.";
      }
    }

    if (currentStep === 3 && !processId) {
      return "Selecciona o crea el proceso que utilizará la fila.";
    }

    if (currentStep === 4) {
      const numericOrder = Number(order);
      if (
        !Number.isInteger(numericOrder) ||
        numericOrder < 0
      ) {
        return "El orden debe ser un número entero igual o mayor que cero.";
      }
    }

    if (
      currentStep === 5 &&
      managementCategoryIds.length === 0
    ) {
      return "Selecciona al menos una categoría de gestión.";
    }

    return null;
  }

  function goNext() {
    if (editorKind) {
      setError(
        "Guarda o cancela el editor abierto antes de continuar."
      );
      return;
    }

    const validationError =
      validateStep(step);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStep(
      (current) =>
        Math.min(
          5,
          current + 1
        ) as GuidedRowStep
    );
  }

  function goBack() {
    if (editorKind) {
      closeEditor();
      return;
    }

    setError(null);
    setStep(
      (current) =>
        Math.max(
          1,
          current - 1
        ) as GuidedRowStep
    );
  }

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      saving ||
      submitLockRef.current
    ) {
      return;
    }

    for (const stepToValidate of [
      1, 2, 3, 4, 5,
    ] as GuidedRowStep[]) {
      const validationError =
        validateStep(stepToValidate);
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
      await onSaveTask({
        versionSupermatrizId,
        aspectoId: Number(aspectId),
        procesoId: Number(processId),
        codigo: code.trim() || null,
        orden: Number(order),
        ejecucion:
          execution.trim() || null,
        fundamentosSoportes:
          supports.trim() || null,
        responsableActividad:
          responsible.trim() || null,
        metasEstandar:
          goal.trim() || null,
        recursosAdministrativos:
          resources.trim() || null,
        estado: status,
        categoriaGestionIds:
          managementCategoryIds,
      });

      onClose();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar la fila.";

      if (
        message
          .toLowerCase()
          .includes("ya existe una fila")
      ) {
        setStep(3);
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
      title={
        task
          ? "Editar fila paso a paso"
          : "Construir una nueva fila"
      }
      description="La conexión se construye de arriba hacia abajo. Puedes usar elementos existentes o crearlos sin salir de este asistente."
      onClose={onClose}
      busy={saving}
      size="2xl"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Progress value={completion} />

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {step === 1 && !editorKind ? (
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
                {editorKind
                  ? "Cerrar editor"
                  : "Anterior"}
              </button>
            )}

            {step < 5 ? (
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
                form="supermatriz-guided-row-form"
                disabled={
                  saving || Boolean(editorKind)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {task
                  ? "Guardar cambios"
                  : "Crear fila"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <form
        id="supermatriz-guided-row-form"
        onSubmit={submit}
        className="space-y-5"
      >
        <StepNavigator
          currentStep={step}
          onSelect={(nextStep) => {
            if (
              !editorKind &&
              nextStep <= step
            ) {
              setStep(nextStep);
              setError(null);
            }
          }}
        />

        <StepIntro step={step} />

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
            <strong className="block text-red-200">
              Revisa este punto
            </strong>
            {error}
          </div>
        )}

        {step === 1 && (
          <RouteStep
            catalogs={catalogs}
            cycleId={cycleId}
            categoryId={categoryId}
            standardId={standardId}
            categories={categories}
            standards={standards}
            selectedCycle={selectedCycle}
            selectedCategory={selectedCategory}
            selectedStandard={selectedStandard}
            editorKind={editorKind}
            editingExisting={editingExisting}
            versionSupermatrizId={
              versionSupermatrizId
            }
            onCycleChange={changeCycle}
            onCategoryChange={changeCategory}
            onStandardChange={changeStandard}
            onOpenEditor={openEditor}
            onCloseEditor={closeEditor}
            onCycleSaved={(value) => {
              setCycleId(value);
              if (!editingExisting) {
                setCategoryId("");
                setStandardId("");
                setAspectId("");
              }
            }}
            onCategorySaved={(value) => {
              setCategoryId(value);
              if (!editingExisting) {
                setStandardId("");
                setAspectId("");
              }
            }}
            onStandardSaved={(value) => {
              setStandardId(value);
              if (!editingExisting) {
                setAspectId("");
              }
            }}
            onSaveCycle={onSaveCycle}
            onSaveCategory={onSaveCategory}
            onSaveStandard={onSaveStandard}
          />
        )}

        {step === 2 && (
          <AspectStep
            catalogs={catalogs}
            standardId={standardId}
            aspectId={aspectId}
            aspects={aspects}
            selectedAspect={selectedAspect}
            editorOpen={
              editorKind === "aspecto"
            }
            editingExisting={
              editingExisting
            }
            versionSupermatrizId={
              versionSupermatrizId
            }
            onAspectChange={(value) => {
              setAspectId(value);
              closeEditor();
              setError(null);
            }}
            onOpenEditor={(edit) =>
              openEditor("aspecto", edit)
            }
            onCloseEditor={closeEditor}
            onAspectSaved={setAspectId}
            onSaveAspect={onSaveAspect}
          />
        )}

        {step === 3 && (
          <ProcessStep
            catalogs={catalogs}
            processId={processId}
            selectedProcess={selectedProcess}
            editorOpen={
              editorKind === "proceso"
            }
            editingExisting={
              editingExisting
            }
            versionSupermatrizId={
              versionSupermatrizId
            }
            onProcessChange={(value) => {
              setProcessId(value);
              closeEditor();
              setError(null);
            }}
            onOpenEditor={(edit) =>
              openEditor("proceso", edit)
            }
            onCloseEditor={closeEditor}
            onProcessSaved={setProcessId}
            onSaveProcess={onSaveProcess}
          />
        )}

        {step === 4 && (
          <OperationStep
            code={code}
            order={order}
            execution={execution}
            supports={supports}
            responsible={responsible}
            goal={goal}
            resources={resources}
            status={status}
            onCodeChange={setCode}
            onOrderChange={setOrder}
            onExecutionChange={setExecution}
            onSupportsChange={setSupports}
            onResponsibleChange={
              setResponsible
            }
            onGoalChange={setGoal}
            onResourcesChange={setResources}
            onStatusChange={setStatus}
          />
        )}

        {step === 5 && (
          <ConfirmationStep
            catalogs={catalogs}
            selectedIds={
              managementCategoryIds
            }
            selectedCycle={selectedCycle}
            selectedCategory={
              selectedCategory
            }
            selectedStandard={
              selectedStandard
            }
            selectedAspect={selectedAspect}
            selectedProcess={selectedProcess}
            selectedManagementCategories={
              selectedManagementCategories
            }
            execution={execution}
            responsible={responsible}
            onToggle={
              toggleManagementCategory
            }
          />
        )}
      </form>
    </AppModal>
  );
}

function Progress({
  value,
}: {
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500">
        Progreso
      </span>
      <div className="h-2 w-28 overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-cyan-400">
        {value}%
      </span>
    </div>
  );
}

function findById<T extends { id: number }>(
  items: T[],
  id: string
): T | null {
  return (
    items.find(
      (item) => item.id === Number(id)
    ) ?? null
  );
}

