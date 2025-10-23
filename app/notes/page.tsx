// app/notes/page.tsx
import { redirect } from "next/navigation";

export default function NotesIndex() {
  redirect("/notes/filter/all");
}
