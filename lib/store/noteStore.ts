"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export type Draft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

// type NoteState = {
//   draft: Draft;
//   setDraft: (partial: Partial<Draft>) => void;
//   clearDraft: () => void;
// };

// export const useNoteStore = create<NoteState>()(
//   persist(
//     (set, get) => ({
//       draft: initialDraft,
//       setDraft: (partial) => set({ draft: { ...get().draft, ...partial } }),
//       clearDraft: () => set({ draft: initialDraft }),
//     }),
//     {
//       name: "notehub-draft",
//       partialize: (state) => ({ draft: state.draft }),
//     }
//   )
// );
// ...
type NoteState = {
  draft: Draft;
  setDraft: (partial: Partial<Draft>) => void;
  clearDraft: () => void;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (partial) => set({ draft: { ...get().draft, ...partial } }),
      clearDraft: () => set({ draft: initialDraft }),
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "notehub-draft",
      partialize: (state) => ({ draft: state.draft }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
