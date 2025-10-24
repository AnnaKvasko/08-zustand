// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { fetchNoteById } from "@/lib/api";
// import type { Note } from "@/types/note";
// import css from "./NoteDetails.module.css";

// type Props = { id: string };

// export default function NoteDetailsClient({ id }: Props) {
//   const {
//     data: note,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<Note>({
//     queryKey: ["note", id],
//     queryFn: ({ signal }) => fetchNoteById(id, signal),
//     staleTime: 30_000,
//     gcTime: 5 * 60_000,
//   });

//   if (isLoading) {
//     return <p className={css.message}>Loading, please wait…</p>;
//   }

//   if (isError || !note) {
//     return (
//       <p className={css.message}>
//         {(error as Error)?.message ?? "Something went wrong."}
//       </p>
//     );
//   }

//   return (
//     <div className={css.container}>
//       <article className={css.item}>
//         <header className={css.header}>
//           <h2 id="note-preview-title" className={css.title}>
//             {note.title}
//           </h2>
//           <p className={css.tag}>Tag: {note.tag}</p>
//         </header>
//         <p className={css.content}>{note.content}</p>
//         <footer className={css.footer}>
//           <time className={css.date} dateTime={note.createdAt}>
//             Created: {new Date(note.createdAt).toLocaleString()}
//           </time>
//         </footer>
//       </article>
//     </div>
//   );
// }
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return (
      <main className={css.container}>
        <article className={css.item}>
          <p>Loading…</p>
        </article>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className={css.container}>
        <article className={css.item}>
          <p>Note not found.</p>
          <button className={css.backBtn} onClick={() => router.back()}>
            Go back
          </button>
        </article>
      </main>
    );
  }

  return (
    <main className={css.container}>
      <article className={css.item}>
        <header className={css.header}>
          <h2>{data.title}</h2>
          <span className={css.tag}>{data.tag}</span>
        </header>

        <p className={css.content}>{data.content}</p>

        <button className={css.backBtn} onClick={() => router.back()}>
          Go back
        </button>
      </article>
    </main>
  );
}
