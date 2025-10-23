import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — NoteHub",
  description: "Sorry, this page does not exist in NoteHub.",
  openGraph: {
    title: "Page Not Found — NoteHub",
    description: "This page could not be found on NoteHub.",
    url: "https://notehub.example.com/not-found",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFoundPage() {
  return (
    <main style={{ textAlign: "center", padding: "80px" }}>
      <h1>404 — Page Not Found</h1>
      <p>Sorry, we couldn’t find the page you were looking for.</p>
    </main>
  );
}
