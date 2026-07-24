import type {
  AspectCatalog,
  MatrixCatalogs,
  MatrixTask,
  MatrixTaskPayload,
  PhvaCycle,
  ProcessCatalog,
  Standard,
  StandardCategory,
} from "../types/supermatriz.types";
import MatrixGrid from "./matrix-grid/MatrixGrid";

interface Props {
  tasks: MatrixTask[];
  catalogs: MatrixCatalogs;
  loading: boolean;
  canEdit: boolean;
  deactivatingTaskId?: number | null;
  onView: (task: MatrixTask) => void;
  onEdit: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
  onEditCycle: (cycle: PhvaCycle) => void;
  onEditCategory: (category: StandardCategory) => void;
  onEditStandard: (standard: Standard) => void;
  onEditAspect: (aspect: AspectCatalog) => void;
  onEditProcess: (process: ProcessCatalog) => void;
  onSaveTask: (
    current: MatrixTask,
    payload: MatrixTaskPayload
  ) => Promise<unknown>;
}

export default function SupermatrizTable(props: Props) {
  return <MatrixGrid {...props} />;
}
