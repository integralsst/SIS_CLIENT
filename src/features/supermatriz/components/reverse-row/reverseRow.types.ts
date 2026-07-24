import type {
  BuilderAspectDraft,
  BuilderCategoryDraft,
  BuilderCycleDraft,
  BuilderEntityMode,
  BuilderProcessDraft,
  BuilderStandardDraft,
  BuilderTaskDraft,
} from "../../types/supermatriz.types";

export type ReverseRowStep =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6;

export interface ReverseRowState {
  aspectMode: BuilderEntityMode;
  aspectId: string;
  aspectDraft: BuilderAspectDraft;

  standardMode: BuilderEntityMode;
  standardId: string;
  standardDraft: BuilderStandardDraft;

  categoryMode: BuilderEntityMode;
  categoryId: string;
  categoryDraft: BuilderCategoryDraft;

  cycleMode: BuilderEntityMode;
  cycleId: string;
  cycleDraft: BuilderCycleDraft;

  processMode: BuilderEntityMode;
  processId: string;
  processDraft: BuilderProcessDraft;

  taskDraft: BuilderTaskDraft;
}
