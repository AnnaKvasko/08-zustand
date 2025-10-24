import "./globals.css";
import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import QueryProvider from "@/app/providers/QueryProvider";
import Header from "@/components/Header/Header"; // 👉 додали хедер

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient app for creating, browsing and organizing personal notes.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a simple and efficient app for creating, browsing and organizing personal notes.",
    url: "https://ac.goit.global/fullstack/react/notehub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub OG Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <QueryProvider>
          <Header />

          <main>{children}</main>

          {modal}
        </QueryProvider>
      </body>
    </html>
  );
}
