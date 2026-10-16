import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/src/auth/session";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Horizon — Plataforma de eventos en vivo",
  description: "Donde cada torneo se vuelve un evento. Chat en vivo, sincronizado, sin retraso.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  //el layout es de servidor, así que puede leer la cookie y pasarle la sesión al navbar
  const session = await getSession();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <Navbar session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}