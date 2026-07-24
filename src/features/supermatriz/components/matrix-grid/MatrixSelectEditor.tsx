import {
  Edit2,
  Loader2,
  Save,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import MatrixCellMenu from "./MatrixCellMenu";

interface Option {
  value: number | string;
  label: string;
}

interface Props {
  value: number | string;
  display: string;
  title: string;
  options: Option[];
  canEdit: boolean;
  onSave: (value: string) => Promise<unknown>;
  onEditCurrent?: () => void;
  toneClassName?: string;
}

export default function MatrixSelectEditor({
  value,
  display,
  title,
  options,
  canEdit,
  onSave,
  onEditCurrent,
  toneClassName = "text-neutral-200",
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(String(value));
      setError(null);
    }
  }, [open, value]);

  async function save() {
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
      label={<span className={toneClassName}>{display}</span>}
      minWidth={410}
    >
      <div className="space-y-3">
        <select
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-xl border border-neutral-700 bg-[#080808] px-3 py-3 text-sm text-white outline-none focus:border-cyan-500/60"
        >
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-between gap-2">
          {onEditCurrent ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setOpen(false);
                onEditCurrent();
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-700 px-3 py-2 text-xs text-neutral-300"
            >
              <Edit2 size={14} />
              Editar registro
            </button>
          ) : <span />}

          <div className="flex gap-2">
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
              disabled={saving || draft === String(value)}
              onClick={() => void save()}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-black disabled:opacity-40"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </MatrixCellMenu>
  );
}
