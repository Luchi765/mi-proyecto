import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { RegistroServiceWorker } from "./componentes/RegistroServiceWorker";

export const metadata: Metadata = {
  title: "Mascotas App",
  description: "Registro de mascotas y sus vacunas",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#C2410C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-orange-50 text-stone-800">
        <RegistroServiceWorker />
        <header className="bg-orange-700 text-white shadow">
          <nav className="mx-auto flex max-w-4xl items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold">
              🐾 Mascotas
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:underline">
                Listado
              </Link>
              <Link href="/mascotas/nueva" className="hover:underline">
                Nueva mascota
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 p-4">{children}</main>
        <footer className="p-4 text-center text-sm text-stone-500">
          TP Integrador · Programación Web Dinámica · EPET N° 30
        </footer>
      </body>
    </html>
  );
}
