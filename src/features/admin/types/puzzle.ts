import type { GeneratedPreviewDto } from "@/shared/repository/puzzle/dto";

export interface WordFormInput {
  text: string;
  clue: string;
}

export interface CreatePuzzleFormState {
  title: string;
  words: WordFormInput[];
  preview: GeneratedPreviewDto | null;
  isGenerating: boolean;
  isPublishing: boolean;
  error: string | null;
}
