import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
});

const SITE_URL = "https://example.com"; // заміни на реальний домен свого Vercel-деплою
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub — простий застосунок для створення й організації нотаток.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub — простий застосунок для створення й організації нотаток.",
    url: SITE_URL,
    images: [{ url: OG_IMAGE }],
    siteName: "NoteHub",
    type: "website",
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          <main id="main" role="main">
            {children}
          </main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
