import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EMPRESAI — Arma tu negocio con IA en 30 días, 5 minutos al día",
  description:
    "Sin cursos ni hoja en blanco. Cada día la IA arma una pieza de tu negocio con el Método Pieza a Pieza. Empieza con 7 días gratis.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${bricolage.variable} ${instrument.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
