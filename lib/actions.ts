"use server";

import { createNote } from "@/lib/api";
import { TAGS, type NoteTag } from "@/types/note";

function toNoteTag(v: unknown): NoteTag {
  return typeof v === "string" && (TAGS as readonly string[]).includes(v)
    ? (v as NoteTag)
    : "Todo";
}

export async function createNoteAction(formData: FormData) {
  const titleRaw = formData.get("title");
  const contentRaw = formData.get("content");
  const tagRaw = formData.get("tag");

  const title = typeof titleRaw === "string" ? titleRaw : "";
  const content = typeof contentRaw === "string" ? contentRaw : "";
  const tag: NoteTag = toNoteTag(tagRaw);

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  await createNote({ title, content, tag }); 
  return { ok: true };
}
