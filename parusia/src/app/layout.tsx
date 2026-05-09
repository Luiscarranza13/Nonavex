import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://parusia.novanex.pe";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Parusia",
  title: "Parusia | Detergente de Novanex",
  description:
    "Parusia es un detergente de Novanex disenado para una limpieza profunda, aroma fresco y gran rendimiento.",
  keywords: ["Parusia", "Novanex", "detergente", "detergente en polvo", "limpieza de ropa"],
  openGraph: {
    title: "Parusia | Detergente de Novanex",
    description: "Limpieza profunda, aroma fresco y gran rendimiento en una presentacion de 850g.",
    url: siteUrl,
    type: "website",
    siteName: "Parusia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parusia | Detergente de Novanex",
    description: "Detergente en polvo de alto rendimiento para el hogar.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
