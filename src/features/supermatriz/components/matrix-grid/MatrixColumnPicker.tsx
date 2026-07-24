import {
  Columns3,
  RotateCcw,
} from "lucide-react";
import {
  useState,
} from "react";
import MatrixCellMenu from "./MatrixCellMenu";
import type {
  MatrixColumnKey,
} from "./matrixGrid.types";
import {
  DEFAULT_VISIBLE_COLUMNS,
  MATRIX_COLUMNS,
} from "./matrixGrid.utils";

interface Props {
  visible: MatrixColumnKey[];
  onChange: (columns: MatrixColumnKey[]) => void;
}

const REQUIRED: MatrixColumnKey[] = [
  "orden",
  "proceso",
  "aspecto",
  "acciones",
];

export default function MatrixColumnPicker({
  visible,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  function toggle(key: MatrixColumnKey) {
    if (REQUIRED.includes(key)) return;
    onChange(
      visible.includes(key)
        ? visible.filter((item) => item !== key)
        : [...visible, key]
    );
  }

  return (
    <MatrixCellMenu
      open={open}
      onOpenChange={setOpen}
      title="Columnas visibles"
      label={
        <span className="flex items-center gap-2 whitespace-nowrap text-sm text-neutral-300">
          <Columns3 size={16} />
          Columnas
        </span>
      }
      triggerClassName="border border-neutral-800 bg-[#090909] px-3 py-2.5"
      minWidth={360}
    >
      <div className="space-y-3">
        <div className="grid gap-1.5 sm:grid-cols-2">
          {MATRIX_COLUMNS.map((column) => {
            const required = REQUIRED.includes(column.key);
            return (
              <label
                key={column.key}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-neutral-300 hover:bg-neutral-800/70"
              >
                <input
                  type="checkbox"
                  checked={visible.includes(column.key)}
                  disabled={required}
                  onChange={() => toggle(column.key)}
                />
                <span>{column.label}</span>
              </label>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_VISIBLE_COLUMNS)}
          className="flex items-center gap-2 rounded-xl border border-neutral-700 px-3 py-2 text-xs text-neutral-300"
        >
          <RotateCcw size={14} />
          Mostrar todas
        </button>
      </div>
    </MatrixCellMenu>
  );
}
