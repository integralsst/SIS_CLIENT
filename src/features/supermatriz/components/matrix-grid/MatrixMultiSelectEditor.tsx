import {
  Loader2,
  Save,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import type {
  ManagementCategory,
} from "../../types/supermatriz.types";
import MatrixCellMenu from "./MatrixCellMenu";

interface Props {
  selectedIds: number[];
  categories: ManagementCategory[];
  canEdit: boolean;
  onSave: (ids: number[]) => Promise<unknown>;
}

export default function MatrixMultiSelectEditor({
  selectedIds,
  categories,
  canEdit,
  onSave,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number[]>(selectedIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(selectedIds);
      setError(null);
    }
  }, [open, selectedIds]);

  function toggle(id: number) {
    setDraft((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function save() {
    if (draft.length === 0) {
      setError("Selecciona al menos una categoría de gestión.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      setOpen(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar el cambio."
      );
    } finally {
      setSaving(false);
    }
  }

  const display = categories
    .filter((item) => selectedIds.includes(item.id))
    .map((item) => item.nombre)
    .join(" · ") || "Sin categoría";

  return (
    <MatrixCellMenu
      open={open}
      onOpenChange={setOpen}
      disabled={!canEdit}
      title="Categorías de gestión"
      label={<span className="text-violet-200">{display}</span>}
      minWidth={360}
    >
      <div className="space-y-3">
        <div className="space-y-2">
          {categories.map((category) => {
            const checked = draft.includes(category.id);
            return (
              <label
                key={category.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                  checked
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-100"
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(category.id)}
                  className="mt-0.5"
                />
                <span>{category.nombre}</span>
              </label>
            );
          })}
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => setOpen(false)}
            className="rounded-xl border border-neutral-700 px-3 py-2 text-xs text-neutral-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-black disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Guardar
          </button>
        </div>
      </div>
    </MatrixCellMenu>
  );
}
