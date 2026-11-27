import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "RuasSetara — Website Pembelajaran Interaktif PLSV & PtLSV SMP Kelas VII",
  description:
    "Media pembelajaran digital interaktif Persamaan & Pertidaksamaan Linear Satu Variabel (PLSV & PtLSV) melalui eksplorasi visual-simbolik, LKPD 3 LKS, evaluasi berpikir kreatif, dan scaffolding bertingkat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-[var(--canvas)] font-sans text-[var(--ink)] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
