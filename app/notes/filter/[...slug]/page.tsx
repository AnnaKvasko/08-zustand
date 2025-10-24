import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NotesListResponse } from "@/lib/types";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams?: { page?: string; search?: string };
}) {
  const tag = params.slug?.[0] ?? "all";
  const page = Number(searchParams?.page ?? 1);
  const search = searchParams?.search ?? "";
  const perPage = 12;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<NotesListResponse>({
    queryKey: ["notes", { page, search, perPage, tag }],
    queryFn: ({ signal }) =>
      fetchNotes(
        {
          page,
          perPage,
          search,
          tag: tag !== "all" ? (tag as any) : undefined,
        },
        signal
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
        currentTag={tag as any}
      />
    </HydrationBoundary>
  );
}
