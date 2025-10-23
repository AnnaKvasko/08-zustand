import type { Metadata } from "next";
import { TAGS } from "@/types/note";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { NotesListResponse } from "@/lib/types";

const SITE_URL = "https://notehub.example.com";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";


export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";
  const validTag = (TAGS as readonly string[]).includes(tag as any) ? tag : "all";

  const title =
    validTag === "all" ? "Notes — All Notes" : `Notes — Filter: ${validTag}`;
  const description = `Browse your notes filtered by tag: ${validTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${validTag}`,
      images: [{ url: OG_IMAGE }],
    },
  };
}


export default async function NotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr, search = "" } = await searchParams;

  const tag = slug?.[0] ?? "all";
  const page = Number(pageStr ?? 1);
  const perPage = 12;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<NotesListResponse>({
    queryKey: ["notes", { page, search, perPage, tag }],
    queryFn: ({ signal }) =>
      fetchNotes({ page, perPage, search, tag: tag !== "all" ? (tag as any) : undefined }, signal),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
        currentTag={(tag as any) ?? "all"}
      />
    </HydrationBoundary>
  );
}
