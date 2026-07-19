import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Loader2 } from "lucide-react";

import AppModal from "../../../components/ui/AppModal";
import AppSelect from "../../../components/ui/AppSelect";
import type {
  MatrixVersionPayload,
  MatrixVersionStatus,
} from "../types/supermatriz.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (payload: MatrixVersionPayload) => Promise<void>;
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

export default function VersionModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<MatrixVersionStatus>("BORRADOR");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setStatus("BORRADOR");
    setValidFrom("");
    setValidUntil("");
    setError(null);
  }, [open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave({
        nombre: name.trim(),
        descripcion: description.trim() || null,
        estado: status,
        vigenteDesde: validFrom || null,
        vigenteHasta: validUntil || null,
      });
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible crear la versión."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      open={open}
      title="Nueva versión de la Supermatriz"
      description="Una versión vigente cerrará automáticamente la versión vigente anterior."
      onClose={onClose}
      busy={saving}
      size="lg"
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
            form="matrix-version-form"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear versión
          </button>
        </div>
      }
    >
      <form id="matrix-version-form" onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-400">
            Nombre *
          </span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Supermatriz 2027"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-400">
            Descripción
          </span>
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-400">
            Estado
          </span>
          <AppSelect
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as MatrixVersionStatus)
            }
          >
            <option value="BORRADOR">Borrador</option>
            <option value="VIGENTE">Vigente</option>
            <option value="CERRADA">Cerrada</option>
          </AppSelect>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              Vigente desde
            </span>
            <input
              type="date"
              value={validFrom}
              onChange={(event) => setValidFrom(event.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              Vigente hasta
            </span>
            <input
              type="date"
              value={validUntil}
              onChange={(event) => setValidUntil(event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </form>
    </AppModal>
  );
}
