// Secciones del panel (módulo común: lo usan el menú, que corre en el navegador, y el inicio, que
// se arma en el servidor; por eso no puede vivir dentro de un componente 'use client').

import { Activity, BrainCircuit, ChartNoAxesCombined, HeartPulse, House, Megaphone, PiggyBank, Settings, Users } from 'lucide-react';

export const SECCIONES = [
  { href: '/admin', etiqueta: 'Inicio', icono: House },
  { href: '/admin/ventas', etiqueta: 'Ventas', icono: ChartNoAxesCombined },
  { href: '/admin/ganancia', etiqueta: 'Ganancia real', icono: PiggyBank },
  { href: '/admin/usuarios', etiqueta: 'Usuarios', icono: Users },
  { href: '/admin/uso', etiqueta: 'Uso y retención', icono: Activity },
  { href: '/admin/canales', etiqueta: 'Canales', icono: Megaphone },
  { href: '/admin/ia', etiqueta: 'IA', icono: BrainCircuit },
  { href: '/admin/salud', etiqueta: 'Salud', icono: HeartPulse },
  { href: '/admin/ajustes', etiqueta: 'Ajustes', icono: Settings },
] as const;
