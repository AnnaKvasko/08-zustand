"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchNotes } from "@/lib/api";
import type { NotesListResponse } from "@/lib/types";
import type { NoteTag } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import QueryError from "@/components/QueryError/QueryError";
import Pagination from "@/components/Pagination/Pagination";
import css from "./Notes.module.css";

type Props = {
  initialPage: number;
  initialSearch: string;
  perPage: number;
  currentTag?: NoteTag | "all";
};

export default function NotesClient({
  initialPage,
  initialSearch,
  perPage,
  currentTag = "all",
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const qpPage = params.get("page") ?? "";
  const qpSearch = params.get("search") ?? "";

  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch] = useDebounce<string>(search, 400);

  const tag = useMemo<NoteTag | undefined>(
    () => (currentTag && currentTag !== "all" ? currentTag : undefined),
    [currentTag]
  );

  const basePath = useMemo(() => {
    if (currentTag && currentTag !== "all") {
      return `/notes/filter/${encodeURIComponent(currentTag)}`;
    }
    if (currentTag === "all") return `/notes/filter/all`;
    return `/notes`;
  }, [currentTag]);

  
  const lastSyncRef = useRef<{ p: number; s: string } | null>(null);
  useEffect(() => {
    const pNum = Number(qpPage);
    const nextPage = Number.isFinite(pNum) && pNum > 0 ? pNum : initialPage;
    const nextSearch = qpSearch || initialSearch;

    const last = lastSyncRef.current;
    if (!last || last.p !== nextPage || last.s !== nextSearch) {
      setPage((prev) => (prev !== nextPage ? nextPage : prev));
      setSearch((prev) => (prev !== nextSearch ? nextSearch : prev));
      lastSyncRef.current = { p: nextPage, s: nextSearch };
    }
  }, [qpPage, qpSearch, initialPage, initialSearch]);

  const queryKey = useMemo(
    () =>
      [
        "notes",
        { page, search: debouncedSearch, perPage, tag: tag ?? "all" },
      ] as const,
    [page, debouncedSearch, perPage, tag]
  );

 
  const baseParams = { page, perPage, search: debouncedSearch || undefined };
  const paramsFetch = tag ? { ...baseParams, tag } : baseParams;

  const { data, isLoading, isError, error, isFetching } = useQuery<
    NotesListResponse,
    Error
  >({
    queryKey,
    queryFn: ({ signal }) => fetchNotes(paramsFetch, signal),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  const items = data?.notes ?? [];

  const pages = useMemo(() => {
    if (typeof data?.totalPages === "number") {
      return Math.max(1, data.totalPages);
    }
    if (items.length === perPage) {
      return Math.max(2, page + 1);
    }
    return 1;
  }, [data, perPage, items.length, page]);

  
  useEffect(() => {
    setPage((prev) => (prev !== 1 ? 1 : prev));
  }, [debouncedSearch, tag]);

  
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);

 
  useEffect(() => {
    const sp = new URLSearchParams();
    if (page !== 1) sp.set("page", String(page));
    const trimmed = debouncedSearch.trim();
    if (trimmed) sp.set("search", trimmed);
    const nextUrl = sp.toString() ? `${basePath}?${sp.toString()}` : basePath;

    const curPage = params.get("page") ?? "";
    const curSearch = params.get("search") ?? "";
    let currentUrl = basePath;
    if (curPage) {
      currentUrl = `${basePath}?page=${curPage}`;
      if (curSearch) currentUrl = `${currentUrl}&search=${curSearch}`;
    } else if (curSearch) {
      currentUrl = `${basePath}?search=${curSearch}`;
    }

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl);
    }
  }, [page, debouncedSearch, basePath, router, params]);

  const onPageChange = (nextPage: number): void => setPage(nextPage);
  const onSearchChange = (value: string): void => setSearch(value);

  return (
    <div className={css.app} aria-busy={isFetching && !isLoading}>
      <header className={css.toolbar}>
        <div className={css.leftBlock}>
          <SearchBox value={search} onChange={onSearchChange} />
        </div>

        {pages > 1 && (
          <div className={css.centerBlock}>
            <Pagination
              key={`top-${pages}-${tag ?? "all"}-${debouncedSearch}`}
              pageCount={pages}
              currentPage={page}
              onPageChange={onPageChange}
            />
          </div>
        )}

        <div className={css.rightBlock}>
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>
      </header>

      {isError && <QueryError error={error} />}

      {items.length > 0 && (
        <NoteList
          notes={items}
          page={page}
          search={debouncedSearch}
          perPage={perPage}
          tagKey={tag ?? "all"}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <p>No notes {debouncedSearch ? `for “${debouncedSearch}”` : "yet"}.</p>
      )}

      {pages > 1 && (
        <Pagination
          key={`bottom-${pages}-${tag ?? "all"}-${debouncedSearch}`}
          pageCount={pages}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
