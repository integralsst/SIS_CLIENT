import {
  Loader2,
  Save,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import MatrixCellMenu from "./MatrixCellMenu";
import { textOrDash } from "./matrixGrid.utils";

interface Props {
  value: string | null;
  title: string;
  canEdit: boolean;
  multiline?: boolean;
  numeric?: boolean;
  onSave: (value: string) => Promise<unknown>;
}

export default function MatrixTextEditor({
  value,
  title,
  canEdit,
  multiline = true,
  numeric = false,
  onSave,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(value ?? "");
      setError(null);
    }
  }, [open, value]);

  async function save() {
    if (numeric) {
      const parsed = Number(draft);
      if (!Number.isInteger(parsed) || parsed < 0) {
        setError("Escribe un número entero igual o mayor que cero.");
        return;
      }
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

  return (
    <MatrixCellMenu
      open={open}
      onOpenChange={setOpen}
      disabled={!canEdit}
      title={title}
      label={
        <span className={value ? "text-neutral-200" : "text-neutral-600"}>
          {textOrDash(value)}
        </span>
      }
      minWidth={390}
    >
      <div className="space-y-3">
        {multiline ? (
          <textarea
            autoFocus
            rows={7}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full resize-y rounded-xl border border-neutral-700 bg-[#080808] px-3 py-3 text-sm leading-6 text-white outline-none focus:border-cyan-500/60"
          />
        ) : (
          <input
            autoFocus
            type={numeric ? "number" : "text"}
            min={numeric ? 0 : undefined}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-[#080808] px-3 py-3 text-sm text-white outline-none focus:border-cyan-500/60"
          />
        )}

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
