import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create Note — NoteHub",
  description:
    "Create a new note in NoteHub. Write, edit, and organize your ideas easily with auto-saved drafts.",
  openGraph: {
    title: "Create Note — NoteHub",
    description:
      "Start creating a new note in NoteHub. Your drafts are auto-saved so you never lose your progress.",
    url: "https://notehub.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Create Note",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
