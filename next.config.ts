import type { NextConfig } from "next";

// Cabeceras de seguridad (auditoría 2026-10-23, I3 · 09/27). La app no carga nada de terceros en el
// navegador: fuentes e imágenes son propias y el navegador solo habla con NUESTRO servidor (la IA,
// Supabase y Hotmart se llaman desde el servidor; Hotmart se abre como página aparte).
// 'unsafe-inline' en scripts lo exige Next para su arranque sin nonce; 'unsafe-eval' solo en desarrollo.
const desarrollo = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${desarrollo ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const cabeceras = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: cabeceras }];
  },
};

export default nextConfig;
