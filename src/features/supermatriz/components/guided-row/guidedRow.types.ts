import type {
  AspectCatalog,
  AspectPayload,
  CyclePayload,
  PhvaCycle,
  ProcessCatalog,
  ProcessPayload,
  Standard,
  StandardCategory,
  StandardCategoryPayload,
  StandardPayload,
} from "../../types/supermatriz.types";

export type GuidedRowStep =
  | 1
  | 2
  | 3
  | 4
  | 5;

export type InlineEditorKind =
  | "ciclo"
  | "categoria"
  | "estandar"
  | "aspecto"
  | "proceso";

export type PeriodPreset =
  | "MENSUAL"
  | "TRIMESTRAL"
  | "SEMESTRAL"
  | "ANUAL"
  | "CADA_3_ANIOS";

export interface GuidedRowCatalogActions {
  onSaveCycle: (
    current: PhvaCycle | null,
    payload: CyclePayload
  ) => Promise<unknown>;
  onSaveCategory: (
    current: StandardCategory | null,
    payload: StandardCategoryPayload
  ) => Promise<unknown>;
  onSaveStandard: (
    current: Standard | null,
    payload: StandardPayload
  ) => Promise<unknown>;
  onSaveAspect: (
    current: AspectCatalog | null,
    payload: AspectPayload
  ) => Promise<unknown>;
  onSaveProcess: (
    current: ProcessCatalog | null,
    payload: ProcessPayload
  ) => Promise<unknown>;
}
