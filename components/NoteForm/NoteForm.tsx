"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNoteAction } from "@/lib/actions";
import type { NoteTag } from "@/types/note";
import { TAGS } from "@/types/note";
import css from "./NoteForm.module.css";

type CreateResult = { ok: true };
function isCreateResult(x: unknown): x is CreateResult {
  return !!x && typeof x === "object" && "ok" in x;
}

type CreatePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

export default function NoteForm() {
  const router = useRouter();
  const qc = useQueryClient();

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
  }, [mounted, draft.title, draft.content, draft.tag]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ title, content, tag }: CreatePayload) => {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      fd.append("tag", tag);
      const res = await createNoteAction(fd);
      if (!isCreateResult(res)) {
        throw new Error("Failed to create note");
      }
      return res;
    },
    onSuccess: async () => {
      clearDraft();

      await qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) && q.queryKey[0] === "notes",
      });
      router.back();
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (title.trim().length < 3 || content.trim().length === 0) return;
    mutate({ title: title.trim(), content: content.trim(), tag });
  }

  if (!mounted) return null;

  return (
    <form
      onSubmit={onSubmit}
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
          disabled={isPending}
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
          disabled={isPending}
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
          disabled={isPending}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={`${css.button} ${css.cancel}`}
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.button}
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>

      {isError && (
        <p role="alert" className={css.hint}>
          {(error as Error)?.message ?? "Something went wrong"}
        </p>
      )}

      <p className={css.hint}>
        <Link href="/notes" className={css.link}>
          Back to notes
        </Link>
      </p>
    </form>
  );
}
