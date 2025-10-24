"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

type DraftState = {
  title: string;
  content: string;
  tag: NoteTag;
};

interface NoteStore {
  draft: DraftState;
  setDraft: (data: Partial<DraftState>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: {
        title: "",
        content: "",
        tag: "Todo",
      },
      setDraft: (data) =>
        set((state) => ({
          draft: { ...state.draft, ...data },
        })),
      clearDraft: () =>
        set(() => ({
          draft: { title: "", content: "", tag: "Todo" },
        })),
    }),
    {
      name: "note-draft",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
