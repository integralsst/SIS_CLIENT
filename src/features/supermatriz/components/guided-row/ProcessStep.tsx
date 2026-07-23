import {
  useState,
  type FormEvent,
} from "react";

import type {
  MatrixCatalogs,
  ProcessCatalog,
} from "../../types/supermatriz.types";
import {
  Field,
  inputClass,
  QuickEditorShell,
  SelectionBlock,
} from "./GuidedRowShared";
import type {
  GuidedRowCatalogActions,
} from "./guidedRow.types";
import {
  errorText,
  readId,
} from "./guidedRow.utils";

interface Props {
  catalogs: MatrixCatalogs;
  processId: string;
  selectedProcess: ProcessCatalog | null;
  editorOpen: boolean;
  editingExisting: boolean;
  versionSupermatrizId: number;
  onProcessChange: (value: string) => void;
  onOpenEditor: (edit: boolean) => void;
  onCloseEditor: () => void;
  onProcessSaved: (value: string) => void;
  onSaveProcess: GuidedRowCatalogActions["onSaveProcess"];
}

export default function ProcessStep({
  catalogs,
  processId,
  selectedProcess,
  editorOpen,
  editingExisting,
  versionSupermatrizId,
  onProcessChange,
  onOpenEditor,
  onCloseEditor,
  onProcessSaved,
  onSaveProcess,
}: Props) {
  return (
    <div className="space-y-4">
      <SelectionBlock
        number="5"
        title="Proceso administrativo"
        explanation="El proceso indica desde qué actividad, área o línea de trabajo se atenderá el aspecto."
        value={processId}
        onChange={onProcessChange}
        onCreate={() => onOpenEditor(false)}
        onEdit={
          selectedProcess
            ? () => onOpenEditor(true)
            : undefined
        }
      >
        <option value="">
          Selecciona un proceso
        </option>
        {catalogs.procesos
          .filter(
            (item) =>
              item.estado === "ACTIVO"
          )
          .map((process) => (
            <option
              key={process.id}
              value={process.id}
            >
              {process.codigo
                ? `${process.codigo} · `
                : ""}
              {process.nombre}
            </option>
          ))}
      </SelectionBlock>

      {editorOpen && (
        <ProcessQuickForm
          current={
            editingExisting
              ? selectedProcess
              : null
          }
          versionSupermatrizId={
            versionSupermatrizId
          }
          onCancel={onCloseEditor}
          onSave={onSaveProcess}
          onSaved={(id) => {
            onProcessSaved(String(id));
            onCloseEditor();
          }}
        />
      )}

      {selectedProcess && !editorOpen && (
        <section className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.045] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
            Proceso seleccionado
          </p>
          <h3 className="mt-2 text-sm font-semibold text-white">
            {selectedProcess.nombre}
          </h3>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            {selectedProcess.descripcion ||
              "Este proceso todavía no tiene una descripción adicional."}
          </p>
          <p className="mt-4 rounded-xl border border-neutral-800 bg-black/20 p-3 text-xs leading-5 text-neutral-400">
            Este proceso puede aparecer en diferentes estándares. La relación se crea únicamente cuando guardas la fila.
          </p>
        </section>
      )}
    </div>
  );
}

function ProcessQuickForm({
  current,
  versionSupermatrizId,
  onCancel,
  onSave,
  onSaved,
}: {
  current: ProcessCatalog | null;
  versionSupermatrizId: number;
  onCancel: () => void;
  onSave: GuidedRowCatalogActions["onSaveProcess"];
  onSaved: (id: number) => void;
}) {
  const [code, setCode] = useState(
    current?.codigo ?? ""
  );
  const [name, setName] = useState(
    current?.nombre ?? ""
  );
  const [description, setDescription] =
    useState(current?.descripcion ?? "");
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
      const result = await onSave(current, {
        versionSupermatrizId,
        codigo: code.trim() || null,
        nombre: name.trim(),
        descripcion:
          description.trim() || null,
        estado: current?.estado ?? "ACTIVO",
      });
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
          ? "Editar proceso"
          : "Crear proceso"
      }
      description="El proceso quedará disponible para esta y otras filas de la versión."
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
        <Field label="Nombre *">
          <input
            required
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className={inputClass}
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
      </div>
    </QuickEditorShell>
  );
}
