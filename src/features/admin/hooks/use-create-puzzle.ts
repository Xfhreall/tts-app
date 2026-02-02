"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import {
  useCreatePuzzleMutation,
  useGeneratePreviewMutation,
} from "@/shared/repository/puzzle/action";
import type { CreatePuzzleFormState, WordFormInput } from "../types/puzzle";

const MAX_WORDS = 15;
const MIN_WORDS = 5;

const initialWords: WordFormInput[] = [
  { text: "", clue: "" },
  { text: "", clue: "" },
  { text: "", clue: "" },
  { text: "", clue: "" },
  { text: "", clue: "" },
];

export function useCreatePuzzle() {
  const router = useRouter();
  const [state, setState] = useState<CreatePuzzleFormState>({
    title: "",
    words: initialWords,
    preview: null,
    isGenerating: false,
    isPublishing: false,
    error: null,
  });

  const generateMutation = useGeneratePreviewMutation();
  const createMutation = useCreatePuzzleMutation();
  const generateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatePreview = useCallback(
    async (words: WordFormInput[]) => {
      const validWords = words.filter((w) => w.text.trim() && w.clue.trim());
      if (validWords.length < MIN_WORDS) return;

      setState((s) => ({ ...s, isGenerating: true, error: null }));

      try {
        const result = await generateMutation.mutateAsync({ words: validWords });
        setState((s) => ({
          ...s,
          preview: result,
          error:
            result.unplacedWords?.length > 0
              ? `Kata tidak dapat ditempatkan: ${result.unplacedWords.join(", ")}`
              : null,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : "Terjadi kesalahan",
        }));
      } finally {
        setState((s) => ({ ...s, isGenerating: false }));
      }
    },
    [generateMutation]
  );

  const setTitle = useCallback((title: string) => {
    setState((s) => ({ ...s, title }));
  }, []);

  const setWords = useCallback(
    (words: WordFormInput[]) => {
      setState((s) => ({ ...s, words }));

      if (generateTimeoutRef.current) {
        clearTimeout(generateTimeoutRef.current);
      }

      const validWords = words.filter((w) => w.text.trim() && w.clue.trim());
      if (validWords.length >= MIN_WORDS) {
        generateTimeoutRef.current = setTimeout(() => {
          generatePreview(words);
        }, 800);
      }
    },
    [generatePreview]
  );

  const addWord = useCallback(() => {
    if (state.words.length >= MAX_WORDS) return;

    const newWords = [...state.words, { text: "", clue: "" }];
    setState((s) => ({ ...s, words: newWords }));
  }, [state.words]);

  const handleGenerate = useCallback(async () => {
    await generatePreview(state.words);
  }, [state.words, generatePreview]);

  const handlePublish = useCallback(async () => {
    if (!state.title.trim()) {
      setState((s) => ({ ...s, error: "Judul puzzle harus diisi" }));
      return;
    }

    const validWords = state.words.filter((w) => w.text.trim() && w.clue.trim());
    setState((s) => ({ ...s, isPublishing: true, error: null }));

    try {
      await createMutation.mutateAsync({
        title: state.title.trim(),
        words: validWords,
        publish: true,
      });
      router.push("/admin");
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : "Terjadi kesalahan",
      }));
    } finally {
      setState((s) => ({ ...s, isPublishing: false }));
    }
  }, [state.title, state.words, createMutation, router]);

  const validWordCount = state.words.filter((w) => w.text.trim() && w.clue.trim()).length;
  const canGenerate = validWordCount >= MIN_WORDS;
  const canAddWord = state.words.length < MAX_WORDS;
  const canPublish = state.preview && state.title.trim() && !state.preview.unplacedWords?.length;

  return {
    ...state,
    setTitle,
    setWords,
    addWord,
    handleGenerate,
    handlePublish,
    validWordCount,
    canGenerate,
    canAddWord,
    canPublish,
    maxWords: MAX_WORDS,
    minWords: MIN_WORDS,
  };
}
