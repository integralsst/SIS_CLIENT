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
} from "react";

import AppModal from "../../../components/ui/AppModal";
import type {
  MatrixCatalogs,
  MatrixTask,
} from "../types/supermatriz.types";
import type {
  BuildMatrixRowPayload,
  BuilderReference,
} from "../types/supermatriz.types";
import AspectFirstStep from "./reverse-row/AspectFirstStep";
import CategoryThirdStep from "./reverse-row/CategoryThirdStep";
import CycleFourthStep from "./reverse-row/CycleFourthStep";
import ProcessFifthStep from "./reverse-row/ProcessFifthStep";
import {
  StepHeader,
  StepNavigator,
} from "./reverse-row/ReverseRowShared";
import RowSixthStep from "./reverse-row/RowSixthStep";
import StandardSecondStep from "./reverse-row/StandardSecondStep";
import type {
  ReverseRowState,
  ReverseRowStep,
} from "./reverse-row/reverseRow.types";
import {
  initialReverseRowState,
} from "./reverse-row/reverseRow.utils";

interface Props {
  open: boolean;
  task: MatrixTask | null;
  catalogs: MatrixCatalogs;
  versionSupermatrizId: number;
  initialProcessId?: number | null;
  onClose: () => void;
  onBuildRow: (
    payload: BuildMatrixRowPayload
  ) => Promise<unknown>;
}

export default function SupermatrizTaskModal({
  open,
  task,
  catalogs,
  versionSupermatrizId,
  initialProcessId = null,
  onClose,
  onBuildRow,
}: Props) {
  const [step, setStep] =
    useState<ReverseRowStep>(1);
  const [state, setState] =
    useState<ReverseRowState>(() =>
      initialReverseRowState(
        catalogs,
        task,
        initialProcessId
      )
    );
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const submitLock = useRef(false);

  useEffect(() => {
    if (!open) return;

    setStep(1);
    setState(
      initialReverseRowState(
        catalogs,
        task,
        initialProcessId
      )
    );
    setSaving(false);
    setError(null);
    submitLock.current = false;
  }, [
    open,
    task,
    initialProcessId,
    versionSupermatrizId,
  ]);

  const selectedAspect = useMemo(
    () =>
      catalogs.aspectos.find(
        (item) =>
          item.id === Number(state.aspectId)
      ) ?? null,
    [catalogs.aspectos, state.aspectId]
  );

  const selectedStandard = useMemo(
    () =>
      catalogs.estandares.find(
        (item) =>
          item.id === Number(state.standardId)
      ) ?? null,
    [catalogs.estandares, state.standardId]
  );

  const selectedCategory = useMemo(
    () =>
      catalogs.categoriasEstandar.find(
        (item) =>
          item.id === Number(state.categoryId)
      ) ?? null,
    [
      catalogs.categoriasEstandar,
      state.categoryId,
    ]
  );

  const selectedCycle = useMemo(
    () =>
      catalogs.ciclosPhva.find(
        (item) =>
          item.id === Number(state.cycleId)
      ) ?? null,
    [catalogs.ciclosPhva, state.cycleId]
  );

  const selectedProcess = useMemo(
    () =>
      catalogs.procesos.find(
        (item) =>
          item.id === Number(state.processId)
      ) ?? null,
    [catalogs.procesos, state.processId]
  );

  const resolvedStandard =
    state.aspectMode === "EXISTENTE"
      ? selectedAspect?.estandar ?? null
      : state.standardMode === "EXISTENTE"
        ? selectedStandard
        : null;

  const resolvedCategory =
    state.aspectMode === "EXISTENTE"
      ? selectedAspect?.estandar
          .categoriaEstandar ?? null
      : state.standardMode === "EXISTENTE"
        ? selectedStandard?.categoriaEstandar ??
          null
        : state.categoryMode === "EXISTENTE"
          ? selectedCategory
          : null;

  const resolvedCycle =
    state.aspectMode === "EXISTENTE"
      ? selectedAspect?.estandar
          .categoriaEstandar.cicloPhva ?? null
      : state.standardMode === "EXISTENTE"
        ? selectedStandard?.categoriaEstandar
            .cicloPhva ?? null
        : state.categoryMode === "EXISTENTE"
          ? selectedCategory?.cicloPhva ?? null
          : state.cycleMode === "EXISTENTE"
            ? selectedCycle
            : null;

  const path = [
    {
      label: "Aspecto",
      value:
        state.aspectMode === "EXISTENTE"
          ? selectedAspect?.nombre ?? ""
          : state.aspectDraft.nombre,
    },
    {
      label: "Estándar",
      value: resolvedStandard
        ? resolvedStandard.nombre
        : state.standardDraft.nombre,
    },
    {
      label: "Categoría",
      value: resolvedCategory
        ? resolvedCategory.nombre
        : state.categoryDraft.nombre,
    },
    {
      label: "Ciclo PHVA",
      value: resolvedCycle
        ? resolvedCycle.nombre
        : state.cycleDraft.nombre,
    },
    {
      label: "Proceso",
      value:
        state.processMode === "EXISTENTE"
          ? selectedProcess?.nombre ?? ""
          : state.processDraft.nombre,
    },
  ];

  const completion = useMemo(() => {
    let completed = 0;

    for (const current of [
      1, 2, 3, 4, 5, 6,
    ] as ReverseRowStep[]) {
      if (!validateStep(current, false)) {
        completed += 1;
      }
    }

    return Math.round((completed / 6) * 100);
  }, [
    state,
    selectedAspect,
    selectedStandard,
    selectedCategory,
    selectedCycle,
    selectedProcess,
  ]);

  function patch(
    value: Partial<ReverseRowState>
  ) {
    setState((current) => ({
      ...current,
      ...value,
    }));
    setError(null);
  }

  function validateStep(
    target: ReverseRowStep,
    showContext = true
  ): string | null {
    if (target === 1) {
      if (state.aspectMode === "EXISTENTE") {
        if (!selectedAspect) {
          return "Selecciona el aspecto que deseas utilizar.";
        }

        if (
          !selectedAspect.planAccionEspecifico ||
          selectedAspect.planAccionEspecifico
            .estado !== "ACTIVO"
        ) {
          return "El aspecto existente debe tener un plan de acción activo.";
        }
      } else {
        if (!state.aspectDraft.nombre.trim()) {
          return "Escribe el nombre del aspecto nuevo.";
        }
        if (
          !state.aspectDraft.planAccionEspecifico.trim()
        ) {
          return "Escribe el plan de acción específico del aspecto.";
        }
        if (
          !Number.isInteger(
            state.aspectDraft.orden
          ) || state.aspectDraft.orden < 0
        ) {
          return "El orden del aspecto debe ser un entero igual o mayor que cero.";
        }
      }
    }

    if (
      target === 2 &&
      state.aspectMode === "NUEVO"
    ) {
      if (state.standardMode === "EXISTENTE") {
        if (!selectedStandard) {
          return "Selecciona el estándar que contendrá el aspecto.";
        }
      } else {
        if (!state.standardDraft.nombre.trim()) {
          return "Escribe el nombre del estándar nuevo.";
        }
        if (
          !Number.isInteger(
            state.standardDraft.orden
          ) || state.standardDraft.orden < 0
        ) {
          return "El orden del estándar debe ser un entero igual o mayor que cero.";
        }
        if (
          state.standardDraft
            .grupoMinisterialIds.length === 0
        ) {
          return "Selecciona por lo menos un grupo ministerial 7, 21 o 60 para el estándar.";
        }
      }
    }

    if (
      target === 3 &&
      state.aspectMode === "NUEVO" &&
      state.standardMode === "NUEVO"
    ) {
      if (state.categoryMode === "EXISTENTE") {
        if (!selectedCategory) {
          return "Selecciona la categoría que contendrá el estándar.";
        }
      } else {
        if (!state.categoryDraft.nombre.trim()) {
          return "Escribe el nombre de la categoría nueva.";
        }
        if (
          !Number.isInteger(
            state.categoryDraft.orden
          ) || state.categoryDraft.orden < 0
        ) {
          return "El orden de la categoría debe ser un entero igual o mayor que cero.";
        }
      }
    }

    if (
      target === 4 &&
      state.aspectMode === "NUEVO" &&
      state.standardMode === "NUEVO" &&
      state.categoryMode === "NUEVO"
    ) {
      if (state.cycleMode === "EXISTENTE") {
        if (!selectedCycle) {
          return "Selecciona el ciclo PHVA de la categoría.";
        }
      } else {
        if (!state.cycleDraft.codigo.trim()) {
          return "Escribe el código del ciclo PHVA.";
        }
        if (!state.cycleDraft.nombre.trim()) {
          return "Escribe el nombre del ciclo PHVA.";
        }
        if (
          !Number.isInteger(
            state.cycleDraft.orden
          ) || state.cycleDraft.orden < 0
        ) {
          return "El orden del ciclo debe ser un entero igual o mayor que cero.";
        }
      }
    }

    if (target === 5) {
      if (state.processMode === "EXISTENTE") {
        if (!selectedProcess) {
          return "Selecciona el proceso que utilizará la fila.";
        }
      } else if (
        !state.processDraft.nombre.trim()
      ) {
        return "Escribe el nombre del proceso nuevo.";
      }
    }

    if (target === 6) {
      if (
        !Number.isInteger(state.taskDraft.orden) ||
        state.taskDraft.orden < 0
      ) {
        return "El orden de la fila debe ser un entero igual o mayor que cero.";
      }
      if (
        state.taskDraft.categoriaGestionIds
          .length === 0
      ) {
        return "Selecciona al menos una categoría de gestión para la fila.";
      }
    }

    if (showContext) {
      setError(null);
    }

    return null;
  }

  function goNext() {
    const validationError =
      validateStep(step);

    if (validationError) {
      setError(validationError);
      return;
    }

    setStep((current) =>
      Math.min(
        6,
        current + 1
      ) as ReverseRowStep
    );
    setError(null);
  }

  function goBack() {
    setStep((current) =>
      Math.max(
        1,
        current - 1
      ) as ReverseRowStep
    );
    setError(null);
  }

  function existingReference(
    id: string
  ): BuilderReference<never> {
    return {
      modo: "EXISTENTE",
      id: Number(id),
    };
  }

  async function submit() {
    if (saving || submitLock.current) return;

    for (const target of [
      1, 2, 3, 4, 5, 6,
    ] as ReverseRowStep[]) {
      const validationError =
        validateStep(target, false);

      if (validationError) {
        setStep(target);
        setError(validationError);
        return;
      }
    }

    const payload: BuildMatrixRowPayload = {
      versionSupermatrizId,
      tareaId: task?.id ?? null,
      aspecto:
        state.aspectMode === "EXISTENTE"
          ? existingReference(state.aspectId)
          : {
              modo: "NUEVO",
              datos: state.aspectDraft,
            },
      proceso:
        state.processMode === "EXISTENTE"
          ? existingReference(state.processId)
          : {
              modo: "NUEVO",
              datos: state.processDraft,
            },
      fila: state.taskDraft,
    };

    if (state.aspectMode === "NUEVO") {
      payload.estandar =
        state.standardMode === "EXISTENTE"
          ? existingReference(
              state.standardId
            )
          : {
              modo: "NUEVO",
              datos: state.standardDraft,
            };
    }

    if (
      state.aspectMode === "NUEVO" &&
      state.standardMode === "NUEVO"
    ) {
      payload.categoria =
        state.categoryMode === "EXISTENTE"
          ? existingReference(
              state.categoryId
            )
          : {
              modo: "NUEVO",
              datos: state.categoryDraft,
            };
    }

    if (
      state.aspectMode === "NUEVO" &&
      state.standardMode === "NUEVO" &&
      state.categoryMode === "NUEVO"
    ) {
      payload.ciclo =
        state.cycleMode === "EXISTENTE"
          ? existingReference(state.cycleId)
          : {
              modo: "NUEVO",
              datos: state.cycleDraft,
            };
    }

    submitLock.current = true;
    setSaving(true);
    setError(null);

    try {
      await onBuildRow(payload);
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar la fila completa."
      );
    } finally {
      submitLock.current = false;
      setSaving(false);
    }
  }

  return (
    <AppModal
      open={open}
      title={
        task
          ? "Editar fila desde el aspecto"
          : "Construir fila en orden inverso"
      }
      description="Primero defines qué se evaluará y después construyes hacia arriba su estándar, categoría y ciclo PHVA. Nada nuevo se guarda hasta el último paso."
      onClose={onClose}
      busy={saving}
      size="2xl"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">
              Completitud
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-cyan-300">
              {completion}%
            </span>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 disabled:opacity-50"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={goBack}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Anterior
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
              >
                Continuar
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {task
                  ? "Guardar cambios"
                  : "Crear fila completa"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <StepNavigator
          current={step}
          onSelect={(target) => {
            setStep(target);
            setError(null);
          }}
        />

        <StepHeader step={step} />

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
            <strong className="block text-red-200">
              Revisa este punto
            </strong>
            {error}
          </div>
        )}

        {step === 1 && (
          <AspectFirstStep
            catalogs={catalogs}
            mode={state.aspectMode}
            aspectId={state.aspectId}
            draft={state.aspectDraft}
            onModeChange={(mode) =>
              patch({
                aspectMode: mode,
                aspectId:
                  mode === "EXISTENTE"
                    ? state.aspectId
                    : "",
              })
            }
            onAspectIdChange={(value) =>
              patch({ aspectId: value })
            }
            onDraftChange={(draftPatch) =>
              patch({
                aspectDraft: {
                  ...state.aspectDraft,
                  ...draftPatch,
                },
              })
            }
          />
        )}

        {step === 2 && (
          <StandardSecondStep
            catalogs={catalogs}
            aspectMode={state.aspectMode}
            selectedAspect={selectedAspect}
            mode={state.standardMode}
            standardId={state.standardId}
            draft={state.standardDraft}
            onModeChange={(mode) =>
              patch({
                standardMode: mode,
                standardId:
                  mode === "EXISTENTE"
                    ? state.standardId
                    : "",
              })
            }
            onStandardIdChange={(value) =>
              patch({ standardId: value })
            }
            onDraftChange={(draftPatch) =>
              patch({
                standardDraft: {
                  ...state.standardDraft,
                  ...draftPatch,
                },
              })
            }
          />
        )}

        {step === 3 && (
          <CategoryThirdStep
            catalogs={catalogs}
            aspectMode={state.aspectMode}
            selectedAspect={selectedAspect}
            standardMode={state.standardMode}
            selectedStandard={selectedStandard}
            mode={state.categoryMode}
            categoryId={state.categoryId}
            draft={state.categoryDraft}
            onModeChange={(mode) =>
              patch({
                categoryMode: mode,
                categoryId:
                  mode === "EXISTENTE"
                    ? state.categoryId
                    : "",
              })
            }
            onCategoryIdChange={(value) =>
              patch({ categoryId: value })
            }
            onDraftChange={(draftPatch) =>
              patch({
                categoryDraft: {
                  ...state.categoryDraft,
                  ...draftPatch,
                },
              })
            }
          />
        )}

        {step === 4 && (
          <CycleFourthStep
            catalogs={catalogs}
            aspectMode={state.aspectMode}
            selectedAspect={selectedAspect}
            standardMode={state.standardMode}
            selectedStandard={selectedStandard}
            categoryMode={state.categoryMode}
            selectedCategory={selectedCategory}
            mode={state.cycleMode}
            cycleId={state.cycleId}
            draft={state.cycleDraft}
            onModeChange={(mode) =>
              patch({
                cycleMode: mode,
                cycleId:
                  mode === "EXISTENTE"
                    ? state.cycleId
                    : "",
              })
            }
            onCycleIdChange={(value) =>
              patch({ cycleId: value })
            }
            onDraftChange={(draftPatch) =>
              patch({
                cycleDraft: {
                  ...state.cycleDraft,
                  ...draftPatch,
                },
              })
            }
          />
        )}

        {step === 5 && (
          <ProcessFifthStep
            catalogs={catalogs}
            mode={state.processMode}
            processId={state.processId}
            draft={state.processDraft}
            onModeChange={(mode) =>
              patch({
                processMode: mode,
                processId:
                  mode === "EXISTENTE"
                    ? state.processId
                    : "",
              })
            }
            onProcessIdChange={(value) =>
              patch({ processId: value })
            }
            onDraftChange={(draftPatch) =>
              patch({
                processDraft: {
                  ...state.processDraft,
                  ...draftPatch,
                },
              })
            }
          />
        )}

        {step === 6 && (
          <RowSixthStep
            catalogs={catalogs}
            draft={state.taskDraft}
            path={path}
            onDraftChange={(draftPatch) =>
              patch({
                taskDraft: {
                  ...state.taskDraft,
                  ...draftPatch,
                },
              })
            }
          />
        )}
      </div>
    </AppModal>
  );
}
