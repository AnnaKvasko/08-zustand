// "use client";

// import { use } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { fetchNoteById } from "@/lib/api";
// import type { Note } from "@/types/note";
// import ModalWrapper from "./ModalWrapper.client";
// import css from "./Modal.module.css";

// type PageProps = {
//   params: Promise<{ id: string }>;
// };

// export default function InterceptedNoteModal({ params }: PageProps) {
//   const { id } = use(params);

//   const router = useRouter();

//   const { data, isLoading, isError } = useQuery<Note>({
//     queryKey: ["note", id],
//     queryFn: () => fetchNoteById(id),
//   });

//   if (isLoading) {
//     return (
//       <ModalWrapper>
//         <p className={css.loading}>Loading…</p>
//         <button
//           type="button"
//           className={css.closeBtn}
//           onClick={() => router.back()}
//         >
//           Close
//         </button>
//       </ModalWrapper>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <ModalWrapper>
//         <p className={css.error}>Failed to load note.</p>
//         <button
//           type="button"
//           className={css.closeBtn}
//           onClick={() => router.back()}
//         >
//           Close
//         </button>
//       </ModalWrapper>
//     );
//   }

//   return (
//     <ModalWrapper>
//       <h2 className={css.title}>{data.title}</h2>

//       <p className={css.tag}>{data.tag}</p>

//       <p className={css.content}>{data.content}</p>

//       <button
//         type="button"
//         className={css.closeBtn}
//         onClick={() => router.back()}
//       >
//         Close
//       </button>
//     </ModalWrapper>
//   );
// }
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import ModalWrapper from "./ModalWrapper.client";
import NotePreviewClient from "./NotePreview.client";
import css from "./Modal.module.css";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function InterceptedNoteModal({ params }: PageProps) {
  // ⬇ Розпаковуємо params, бо в parallel route (@modal) воно Promise
  const { id } = use(params);

  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return (
      <ModalWrapper>
        <p className={css.loading}>Loading…</p>
        <button
          type="button"
          className={css.closeBtn}
          onClick={() => router.back()}
        >
          Close
        </button>
      </ModalWrapper>
    );
  }

  if (isError || !data) {
    return (
      <ModalWrapper>
        <p className={css.error}>Failed to load note.</p>
        <button
          type="button"
          className={css.closeBtn}
          onClick={() => router.back()}
        >
          Close
        </button>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <NotePreviewClient note={data} onClose={() => router.back()} />
    </ModalWrapper>
  );
}
