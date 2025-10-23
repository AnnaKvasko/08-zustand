// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useNoteStore } from "@/lib/store/noteStore";
// import { createNoteAction } from "@/lib/actions";
// import type { NoteTag } from "@/types/note";
// import { TAGS } from "@/types/note";
// import css from "./NoteList.module.css";

// export default function NoteForm() {
//   const { draft, setDraft, clearDraft } = useNoteStore();

//   const [title, setTitle] = useState(draft.title);
//   const [content, setContent] = useState(draft.content);
//   const [tag, setTag] = useState<NoteTag>(draft.tag);

//   useEffect(() => {
//     setDraft({ title, content, tag });
//   }, [title, content, tag, setDraft]);

//   async function handleAction(formData: FormData) {

//     const res = await createNoteAction(formData);
//     if (res && typeof res === "object" && "ok" in res && (res as any).ok) {
//       clearDraft();

//       history.back();
//     }

//   }

//   return (
//     <form action={handleAction} className={css.form}>

//       <div className={css.formGroup}>
//         <label htmlFor="title">Title</label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.currentTarget.value)}
//           required
//           minLength={3}
//           maxLength={50}
//           className={css.input}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="content">Content</label>
//         <textarea
//           id="content"
//           name="content"
//           value={content}
//           onChange={(e) => setContent(e.currentTarget.value)}
//           rows={6}
//           maxLength={500}
//           required
//           className={css.textarea}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="tag">Tag</label>
//         <select
//           id="tag"
//           name="tag"
//           value={tag}
//           onChange={(e) => setTag(e.currentTarget.value as NoteTag)}
//           className={css.select}
//         >
//           {TAGS.map((t) => (
//             <option key={t} value={t}>
//               {t}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className={css.actions}>

//         <button
//           type="button"
//           className={`${css.button} ${css.cancel}`}
//           onClick={() => history.back()}
//         >
//           Cancel
//         </button>
//         <button type="submit" className={css.button}>
//           Save
//         </button>
//       </div>

//       <p className={css.hint}>
//         <Link href="/notes" className={css.link}>
//           Back to notes
//         </Link>
//       </p>
//     </form>
//   );
// }
// components/NoteList/NoteList.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import type { Note } from "@/types/note";
import type { NotesListResponse } from "@/lib/types";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  page: number;
  search: string;
  perPage: number;
  tagKey?: string;
}

type Ctx = { prevData?: NotesListResponse };

export default function NoteList({
  notes,
  page,
  search,
  perPage,
  tagKey = "all",
}: NoteListProps) {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const listKey = ["notes", { page, search, perPage, tag: tagKey }] as const;

  const { mutate } = useMutation<Note, Error, string, Ctx>({
    mutationFn: (id) => deleteNote({ id }),
    onMutate: async (id) => {
      setDeletingId(id);
      await qc.cancelQueries({ queryKey: listKey });

      const prevData = qc.getQueryData<NotesListResponse>(listKey);

      if (prevData) {
        const nextNotes = (prevData.notes ?? []).filter((n) => n.id !== id);

  

        qc.setQueryData<NotesListResponse>(listKey, {
          ...prevData,
          notes: nextNotes,
          
        });
      }

      return { prevData };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevData) {
        qc.setQueryData<NotesListResponse>(listKey, ctx.prevData);
      }
      setDeletingId(null);
    },
    onSuccess: () => {
      // Перестраховка: інвалідовуємо всі списки нотаток
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onSettled: () => setDeletingId(null),
  });

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h3 className={css.title}>{n.title}</h3>
          <p className={css.content}>{n.content}</p>
          <p className={css.tag}>Tag: {n.tag}</p>

          <div className={css.footer}>
            <Link
              href={`/notes/${encodeURIComponent(n.id)}`}
              className={css.link}
            >
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              onClick={() => mutate(n.id)}
              disabled={deletingId === n.id}
              aria-busy={deletingId === n.id}
            >
              {deletingId === n.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
