// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useNoteStore } from "@/lib/store/noteStore";
// import { createNoteAction } from "@/lib/actions";
// import type { NoteTag } from "@/types/note";
// import { TAGS } from "@/types/note";
// import css from "./NoteForm.module.css";

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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNoteAction } from "@/lib/actions";
import type { NoteTag } from "@/types/note";
import { TAGS } from "@/types/note";
import css from "./NoteForm.module.css";

type CreateResult = { ok: true };
function isCreateResult(x: unknown): x is CreateResult {
  return !!x && typeof x === "object" && "ok" in x;
}

function SubmitRow() {
  const { pending } = useFormStatus();
  return (
    <div className={css.actions}>
      <button
        type="button"
        className={`${css.button} ${css.cancel}`}
        onClick={() => history.back()}
        disabled={pending}
      >
        Cancel
      </button>
      <button
        type="submit"
        className={css.button}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<NoteTag>(draft.tag);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  useEffect(() => {
    if (!mounted) return;

    if (draft.title !== title) setTitle(draft.title);
    if (draft.content !== content) setContent(draft.content);
    if (draft.tag !== tag) setTag(draft.tag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, draft.title, draft.content, draft.tag]);

  async function handleAction(formData: FormData) {
    const res = await createNoteAction(formData);
    if (isCreateResult(res)) {
      clearDraft();
      history.back();
    }
  }

  if (!mounted) return null;

  return (
    <form
      action={handleAction}
      className={css.form}
      autoComplete="off"
      suppressHydrationWarning
    >
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
          minLength={3}
          maxLength={50}
          className={css.input}
          suppressHydrationWarning
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          rows={6}
          maxLength={500}
          required
          className={css.textarea}
          suppressHydrationWarning
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.currentTarget.value as NoteTag)}
          className={css.select}
          suppressHydrationWarning
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <SubmitRow />

      <p className={css.hint}>
        <Link href="/notes" className={css.link}>
          Back to notes
        </Link>
      </p>
    </form>
  );
}
