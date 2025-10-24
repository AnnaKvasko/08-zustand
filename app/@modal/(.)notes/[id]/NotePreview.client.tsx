"use client";

import css from "./Modal.module.css";
import type { Note } from "@/types/note";

type NotePreviewProps = {
  note: Note;
  onClose: () => void;
};

export default function NotePreviewClient({ note, onClose }: NotePreviewProps) {
  return (
    <>
      <h2 className={css.title}>{note.title}</h2>

      <p className={css.tag}>{note.tag}</p>

      <p className={css.content}>{note.content}</p>

      <button type="button" className={css.closeBtn} onClick={onClose}>
        Close
      </button>
    </>
  );
}
