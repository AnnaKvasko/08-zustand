// import type { Metadata } from "next";
// import { fetchNoteById } from "@/lib/api";
// import { isAxiosError } from "axios";
// import NoteDetailsClient from "./NoteDetails.client";

// const SITE_URL = "https://notehub.example.com";
// const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const { id } = await params;

//   try {
//     const note = await fetchNoteById(id);
//     const title = `Note — ${note.title}`;
//     const description = note.content
//       ? note.content.slice(0, 120) + "..."
//       : "View note details on NoteHub.";

//     return {
//       title,
//       description,
//       openGraph: {
//         title,
//         description,
//         url: `${SITE_URL}/notes/${id}`,
//         images: [{ url: OG_IMAGE }],
//       },
//     };
//   } catch (e) {
//     if (isAxiosError(e) && e.response?.status === 404) {
//       return {
//         title: "Note Not Found — NoteHub",
//         description: "This note could not be found.",
//         openGraph: {
//           title: "Note Not Found — NoteHub",
//           description: "This note could not be found.",
//           url: `${SITE_URL}/notes/${id}`,
//           images: [{ url: OG_IMAGE }],
//         },
//       };
//     }
//     throw e;
//   }
// }

// export default async function NotePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   return <NoteDetailsClient id={id} />;
// }
import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import { isAxiosError } from "axios";
import NoteDetailsClient from "./NoteDetails.client";

const SITE_URL = "https://notehub.example.com";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const title = `Note — ${note.title}`;
    const description = note.content
      ? note.content.slice(0, 120) + "..."
      : "View note details on NoteHub.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${id}`,
        images: [{ url: OG_IMAGE }],
      },
    };
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) {
      return {
        title: "Note Not Found — NoteHub",
        description: "This note could not be found.",
        openGraph: {
          title: "Note Not Found — NoteHub",
          description: "This note could not be found.",
          url: `${SITE_URL}/notes/${id}`,
          images: [{ url: OG_IMAGE }],
        },
      };
    }
    throw e;
  }
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NoteDetailsClient id={id} />;
}
