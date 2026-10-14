// Contenido y reglas del recorrido de inicio (onboarding anónimo, modelo 2 de ESTADO.md).
// Todo lo que el usuario ve sale de aquí: preguntas, sugerencias por área, el ejercicio
// (nivel intermedio-fácil) y la composición de la Pieza #1. El estado vive en localStorage
// versionado y migra a la cuenta en el primer login (Sesión 5/6).

export type IdPunto = 'idea' | 'oferta' | 'sin-idea';
export type IdFreno = 'blanco' | 'tiempo' | 'teoria' | 'ideas' | 'otro';
export type IdArea = 'servicios' | 'cursos' | 'productos';
export type IdAreaRespuesta = IdArea | 'nose' | 'otra';
export type IdMomento = 'manana' | 'mediodia' | 'noche';
export type Plan = 'anual' | 'mensual';

export type IdPaso =
  | 'punto'
  | 'freno'
  | 'reconocimiento'
  | 'area'
  | 'ayuda'
  | 'idea'
  | 'momento'
  | 'etiqueta'
  | 'ejercicio'
  | 'armando'
  | 'pieza';

export interface Respuestas {
  punto?: IdPunto;
  freno?: IdFreno;
  /** Texto libre si eligió "Otra cosa" en el freno. */
  frenoOtro?: string;
  area?: IdAreaRespuesta;
  /** Texto libre si eligió "Otra cosa" en el área. */
  areaOtra?: string;
  /** Área efectiva: la elegida, o la que sale de la pregunta de ayuda si respondió "No lo sé". */
  areaFinal?: IdArea;
  idea?: string;
  momento?: IdMomento;
  cliente?: string;
  resultado?: string;
  dolor?: string;
}

export interface PrimeraPieza {
  titulo: string;
  frase: string;
  idea: string;
  area: IdArea;
  prueba: string;
  creadaEn: string;
  /** La escribió la IA (si no pudo, se arma con las respuestas). */
  conIA?: boolean;
}

export interface EstadoOnboarding {
  v: 1;
  paso: IdPaso;
  respuestas: Respuestas;
  primeraPieza?: PrimeraPieza;
  plan?: Plan;
}

/* ── Preguntas de opción única ─────────────────────────────────────────────── */

export interface Opcion<T extends string> {
  id: T;
  texto: string;
  icono: 'Lightbulb' | 'Target' | 'Compass' | 'NoteBlank' | 'Clock' | 'GraduationCap' | 'Brain' | 'Briefcase' | 'Books' | 'Package' | 'Signpost' | 'Handshake' | 'ChalkboardTeacher' | 'SunHorizon' | 'Bus' | 'Moon' | 'PencilSimpleLine';
}

export interface Pregunta<T extends string> {
  titulo: string;
  /** Palabra(s) del título que van en dorado (deben existir literal en el título). */
  acento: string;
  ayuda: string;
  opciones: Opcion<T>[];
  /** Salida "Otra cosa (escribe la tuya)" para categorías abiertas (50 §A2). */
  otra?: { id: T; texto: string; placeholder: string };
}

export const PREGUNTA_PUNTO: Pregunta<IdPunto> = {
  titulo: '¿En qué punto está tu idea?',
  acento: 'tu idea',
  ayuda: 'Así sabemos desde dónde empieza tu ruta.',
  opciones: [
    { id: 'idea', texto: 'Tengo una idea, pero no sé por dónde empezar', icono: 'Lightbulb' },
    { id: 'oferta', texto: 'Sé qué vender, pero no tengo oferta ni clientes', icono: 'Target' },
    { id: 'sin-idea', texto: 'Aún no tengo idea: quiero que me sugieras', icono: 'Compass' },
  ],
};

export const PREGUNTA_FRENO: Pregunta<IdFreno> = {
  titulo: '¿Qué te frena hoy?',
  acento: 'te frena',
  ayuda: 'Sé sincero: tu ruta se arma alrededor de esto.',
  opciones: [
    { id: 'blanco', texto: 'Abro la IA y me quedo en blanco', icono: 'NoteBlank' },
    { id: 'tiempo', texto: 'No tengo tiempo: trabajo todo el día', icono: 'Clock' },
    { id: 'teoria', texto: 'Los cursos son caros y pura teoría', icono: 'GraduationCap' },
    { id: 'ideas', texto: 'Tengo mil ideas y no sé cuál elegir', icono: 'Brain' },
  ],
  otra: { id: 'otro', texto: 'Otra cosa (escribe la tuya)', placeholder: 'Ej.: Me da miedo vender' },
};

export const PREGUNTA_AREA: Pregunta<IdAreaRespuesta> = {
  titulo: '¿En qué área quieres enfocar tu negocio?',
  acento: 'tu negocio',
  ayuda: 'Tu primera misión se adapta a esta área.',
  opciones: [
    { id: 'servicios', texto: 'Servicios o consultoría digital', icono: 'Briefcase' },
    { id: 'cursos', texto: 'Cursos, e-books o conocimiento', icono: 'Books' },
    { id: 'productos', texto: 'Productos físicos o comercio', icono: 'Package' },
    { id: 'nose', texto: 'No lo sé, ayúdame a elegir', icono: 'Signpost' },
  ],
  otra: { id: 'otra', texto: 'Otra cosa (escribe la tuya)', placeholder: 'Ej.: Comida casera, belleza…' },
};

export const PREGUNTA_AYUDA: Pregunta<IdArea> = {
  titulo: '¿Qué se te da mejor?',
  acento: 'mejor',
  ayuda: 'Con esto elegimos tu área por ti.',
  opciones: [
    { id: 'servicios', texto: 'Resolverles problemas a otros', icono: 'Handshake' },
    { id: 'cursos', texto: 'Explicar y enseñar lo que sé', icono: 'ChalkboardTeacher' },
    { id: 'productos', texto: 'Crear o vender cosas que se tocan', icono: 'Package' },
  ],
};

export const PREGUNTA_MOMENTO: Pregunta<IdMomento> = {
  titulo: '¿Cuándo harás tu misión de 5 minutos?',
  acento: '5 minutos',
  ayuda: 'A esa hora te recordaremos tu misión del día.',
  opciones: [
    { id: 'manana', texto: 'En la mañana, antes de trabajar', icono: 'SunHorizon' },
    { id: 'mediodia', texto: 'Al mediodía o en el trayecto', icono: 'Bus' },
    { id: 'noche', texto: 'En la noche, después del trabajo', icono: 'Moon' },
  ],
};

export const NOMBRE_AREA: Record<IdArea, string> = {
  servicios: 'Servicios digitales',
  cursos: 'Cursos y conocimiento',
  productos: 'Productos físicos',
};

export const NOMBRE_MOMENTO: Record<IdMomento, string> = {
  manana: 'cada mañana',
  mediodia: 'cada mediodía',
  noche: 'cada noche',
};

/* ── Reconocimiento (fórmula del 50 §A5: patrón → quitar la culpa → mecanismo) ── */

export const RECONOCIMIENTO: Record<
  IdFreno,
  { titulo: string; acento: string; cuerpo: string; fuerte: string; antes: string; antesDato: string }
> = {
  blanco: {
    titulo: 'No te faltan ideas: te sobra la hoja en blanco',
    acento: 'hoja en blanco',
    cuerpo: 'ChatGPT espera que sepas qué pedirle, y a las 7 de la noche nadie lo sabe.',
    fuerte: 'Aquí es al revés: te damos la misión exacta y la IA arma la pieza contigo.',
    antes: 'Frente a ChatGPT',
    antesDato: '15 min en blanco',
  },
  tiempo: {
    titulo: 'Con 5 minutos al día alcanza',
    acento: '5 minutos',
    cuerpo: 'No es que no tengas tiempo: los tutoriales te piden 2 horas que no te sobran.',
    fuerte: 'Aquí cada misión dura 5 minutos y se hace desde el celular.',
    antes: 'Con tutoriales',
    antesDato: '2 h sin avanzar',
  },
  teoria: {
    titulo: 'No necesitas otro curso',
    acento: 'otro curso',
    cuerpo: 'Los cursos te dan teoría y te dejan solo con la parte difícil: aplicarla.',
    fuerte: 'Aquí no hay videos: cada día terminas con una pieza de tu negocio armada.',
    antes: 'Con un curso',
    antesDato: '40 h de teoría',
  },
  otro: {
    titulo: 'Sea lo que sea, se avanza en 5 minutos',
    acento: '5 minutos',
    cuerpo: 'Casi siempre lo que frena es no saber cuál es el paso de hoy.',
    fuerte: 'Aquí cada día tienes una misión exacta y la IA arma la pieza contigo.',
    antes: 'Sin paso claro',
    antesDato: 'Otro día igual',
  },
  ideas: {
    titulo: 'Tener mil ideas no es el problema',
    acento: 'mil ideas',
    cuerpo: 'El problema es no saber cuál es el paso 1, y eso paraliza a cualquiera.',
    fuerte: 'Aquí empiezas por una sola idea y la ruta te dice qué hacer cada día.',
    antes: 'Con mil ideas',
    antesDato: '0 pasos dados',
  },
};

/* ── Sugerencias de idea por área ("Sugerir por mí" — rellenan, no avanzan) ─── */

export const IDEAS_SUGERIDAS: Record<IdArea, string[]> = {
  servicios: [
    'Manejo de redes sociales para negocios locales',
    'Asistente virtual para emprendedores',
    'Diseño de menús y catálogos para restaurantes',
  ],
  cursos: [
    'Mini curso de Excel para dueños de negocio',
    'Guía de comidas saludables para mamás ocupadas',
    'Clases de inglés para empleados que quieren crecer',
  ],
  productos: [
    'Velas aromáticas hechas a mano',
    'Accesorios personalizados para dueños de mascotas',
    'Kits de regalo para quien quiere sorprender',
  ],
};

/* ── El ejercicio: tu propuesta de valor (intermedio-fácil, adaptado al área) ──
   Frase: "Ayudo a [cliente] a [resultado] sin [dolor]." Cada hueco trae 4 opciones del área
   + "Escribir la mía". El consejo enseña el concepto en una línea (aprender haciendo). */

export type IdHueco = 'cliente' | 'resultado' | 'dolor';

export interface Hueco {
  id: IdHueco;
  pregunta: string;
  consejo: string;
  conector: string;
}

export const HUECOS: Hueco[] = [
  { id: 'cliente', pregunta: '¿A quién ayudas?', consejo: 'Mientras más específico, más fácil venderle.', conector: 'ayudo a' },
  { id: 'resultado', pregunta: '¿Qué logra gracias a ti?', consejo: 'Lo que tu cliente gana, no lo que tú haces.', conector: 'a' },
  { id: 'dolor', pregunta: '¿Qué se ahorra o evita?', consejo: 'Lo que hoy le molesta y quiere dejar atrás.', conector: 'sin' },
];

export const OPCIONES_EJERCICIO: Record<IdArea, Record<IdHueco, string[]>> = {
  servicios: {
    cliente: ['dueños de pequeños negocios', 'emprendedores que recién empiezan', 'profesionales independientes', 'tiendas de barrio'],
    resultado: ['conseguir clientes por redes', 'ordenar sus ventas y cobros', 'ahorrar 5 horas a la semana', 'verse profesionales en internet'],
    dolor: ['contratar una agencia cara', 'aprender todo desde cero', 'perder horas en tareas repetidas', 'pelearse con la tecnología'],
  },
  cursos: {
    cliente: ['principiantes sin experiencia', 'mamás y papás con poco tiempo', 'empleados que quieren un ingreso extra', 'estudiantes universitarios'],
    resultado: ['dominar una habilidad en 7 días', 'lograr su primer resultado en una semana', 'aplicar lo aprendido desde el día 1', 'ganar confianza para empezar'],
    dolor: ['cursos eternos de pura teoría', 'gastar cientos de dólares', 'videos de 3 horas', 'sentirse perdidos'],
  },
  productos: {
    cliente: ['mamás que buscan practicidad', 'personas que cuidan su salud', 'amantes de las mascotas', 'personas que buscan regalos únicos'],
    resultado: ['resolver un problema de su día a día', 'regalar algo especial', 'cuidarse con productos naturales', 'ahorrar tiempo en casa'],
    dolor: ['pagar de más en tiendas grandes', 'esperar semanas por un envío', 'conformarse con lo de siempre', 'productos de mala calidad'],
  },
};

/* ── Secuencia del recorrido ──────────────────────────────────────────────── */

export function secuencia(r: Respuestas): IdPaso[] {
  const pasos: IdPaso[] = ['punto', 'freno', 'reconocimiento', 'area'];
  if (r.area === 'nose' || r.area === 'otra') pasos.push('ayuda');
  pasos.push('idea', 'momento', 'etiqueta', 'ejercicio', 'armando', 'pieza');
  return pasos;
}

/** Progreso real 0-1 de la barra: arranca en 8% (progreso dotado) y llega al 100% en el ejercicio. */
export function progreso(paso: IdPaso, r: Respuestas): number {
  const pasos: IdPaso[] = secuencia(r).filter((p) => p !== 'armando' && p !== 'pieza');
  const i = pasos.indexOf(paso);
  if (i < 0) return 1;
  return 0.08 + (0.92 * i) / pasos.length;
}

/** Cuántas respuestas dio el usuario (para "Hecho con tus N respuestas"). */
export function contarRespuestas(r: Respuestas): number {
  return (['punto', 'freno', 'area', 'idea', 'momento', 'cliente', 'resultado', 'dolor'] as const).filter((k) => Boolean(r[k]))
    .length;
}

/* ── Limpieza del texto libre y composición de la Pieza #1 ─────────────────── */

export const LARGO_MAX_IDEA = 120;
export const LARGO_MAX_HUECO = 70;

export function limpiarTexto(texto: string, largoMax: number, quitarInicio?: RegExp): string {
  let t = texto.replace(/\s+/g, ' ').trim();
  if (quitarInicio) t = t.replace(quitarInicio, '');
  t = t.replace(/[.,;:!¡?¿\s]+$/u, '').slice(0, largoMax).trim();
  // "Dueños de gimnasios" → "dueños de gimnasios" (respeta siglas como "PYMES")
  if (t.length > 1 && t[1] === t[1].toLowerCase()) t = t[0].toLowerCase() + t.slice(1);
  return t;
}

export const QUITAR_INICIO: Record<IdHueco, RegExp> = {
  cliente: /^(ayudo\s+)?a\s+/i,
  resultado: /^a\s+/i,
  dolor: /^sin\s+/i,
};

/** El "para quién" que ya viene en su idea ("Mini curso de Excel para dueños de negocio"). */
export function clienteDeLaIdea(idea: string): string | undefined {
  const m = /\bpara\s+(.{3,60})$/i.exec(idea.trim());
  if (!m) return undefined;
  const quien = limpiarTexto(m[1], LARGO_MAX_HUECO);
  // "para la semana", "para el trabajo": no es una persona.
  return /^(la|el|los|las|un|una|que|mi|tu|su)\s/i.test(quien) ? undefined : quien;
}

/** La idea como inicio de la frase: con mayúscula y sin repetir el cliente si ya lo nombra. */
export function ideaEnFrase(idea: string, cliente?: string): string {
  let t = idea.replace(/\s+/g, ' ').trim().replace(/[.,;:!¡?¿\s]+$/u, '');
  const quien = clienteDeLaIdea(t);
  if (quien && cliente && quien.toLowerCase() === cliente.toLowerCase()) {
    t = t.replace(/\s+para\s+.{3,60}$/i, '');
  }
  return t ? t[0].toUpperCase() + t.slice(1) : t;
}

export function armarFrase(r: Pick<Respuestas, 'idea' | 'cliente' | 'resultado' | 'dolor'>): string {
  return `${ideaEnFrase(r.idea ?? '', r.cliente)}: ayudo a ${r.cliente} a ${r.resultado} sin ${r.dolor}.`;
}

/** El tema de una idea de conocimiento ("Mini curso de Excel para…" → "Excel"). */
export function temaDeLaIdea(idea: string): string | undefined {
  const m = /^(?:mini\s+)?(?:curso|cursos|clases|taller|mentoría)\s+de\s+(.+?)(?:\s+para\s+.*)?$/i.exec(idea.trim());
  if (!m) return undefined;
  // Sin limpiarTexto: respeta mayúsculas de nombres propios (Excel, Canva).
  const tema = m[1].replace(/\s+/g, ' ').trim().slice(0, 40);
  return tema.length >= 3 ? tema : undefined;
}

/** Opciones del hueco: lo que su idea ya dice (para quién, de qué tema) va primero. */
export function opcionesHueco(area: IdArea, hueco: IdHueco, idea: string): string[] {
  const base = OPCIONES_EJERCICIO[area][hueco];
  const propia =
    hueco === 'cliente'
      ? clienteDeLaIdea(idea)
      : hueco === 'resultado' && temaDeLaIdea(idea)
        ? 'usarlo paso a paso en su día a día'
        : undefined;
  if (!propia || base.some((o) => o.toLowerCase() === propia.toLowerCase())) return base;
  return [propia, ...base.slice(0, 3)];
}

/** Resumen corto de lo que respondió: se muestra en la ruta y crece con cada respuesta. */
const CORTO_PUNTO: Record<IdPunto, string> = { idea: 'Tienes una idea', oferta: 'Ya sabes qué vender', 'sin-idea': 'Buscas tu idea' };
const CORTO_FRENO: Record<IdFreno, string> = {
  blanco: 'hoja en blanco',
  tiempo: 'poco tiempo',
  teoria: 'mucha teoría',
  ideas: 'mil ideas',
  otro: 'el tuyo',
};

export interface ItemResumen {
  texto: string;
  /** 'freno' es un dato a resolver (sin check verde de "hecho"). */
  tipo: 'logro' | 'freno';
}

export function resumenRespuestas(r: Respuestas): ItemResumen[] {
  const corto = (t: string) => (t.length > 26 ? `${t.slice(0, 25).trimEnd()}…` : t);
  const items: ItemResumen[] = [];
  if (r.punto) items.push({ texto: CORTO_PUNTO[r.punto], tipo: 'logro' });
  if (r.freno) {
    const freno = r.freno === 'otro' && r.frenoOtro ? corto(r.frenoOtro) : CORTO_FRENO[r.freno];
    items.push({ texto: `Freno: ${freno}`, tipo: 'freno' });
  }
  if (r.areaFinal) items.push({ texto: NOMBRE_AREA[r.areaFinal], tipo: 'logro' });
  else if (r.area === 'otra' && r.areaOtra) items.push({ texto: corto(r.areaOtra), tipo: 'logro' });
  if (r.idea) items.push({ texto: corto(r.idea), tipo: 'logro' });
  if (r.momento) {
    items.push({ texto: NOMBRE_MOMENTO[r.momento][0].toUpperCase() + NOMBRE_MOMENTO[r.momento].slice(1), tipo: 'logro' });
  }
  return items;
}

/**
 * Compone la Pieza #1 con las respuestas. Es async a propósito: cuando se conecte la IA real
 * (Sesión 6, ruta de servidor con límite por IP), esta función llamará a esa ruta y mantendrá
 * esta composición como respaldo si la IA falla.
 */
export async function armarPrimeraPieza(r: Respuestas): Promise<PrimeraPieza> {
  if (!r.cliente || !r.resultado || !r.dolor || !r.idea || !r.areaFinal) {
    throw new Error('Faltan respuestas para armar la pieza');
  }
  // La IA escribe la frase (servidor, con límites); si no está disponible, se arma con las respuestas.
  const conIA = await primeraPiezaConIA(r);
  if (conIA) return conIA;
  return {
    titulo: 'Tu frase de negocio',
    frase: armarFrase(r),
    idea: r.idea,
    area: r.areaFinal,
    prueba: `Lee tu frase en voz alta a 3 personas que encajen con «${r.cliente}» y anota qué te responden.`,
    creadaEn: new Date().toISOString(),
  };
}

async function primeraPiezaConIA(r: Respuestas): Promise<PrimeraPieza | null> {
  const control = new AbortController();
  const corte = window.setTimeout(() => control.abort(), 20_000);
  try {
    const res = await fetch('/api/ia/primera-pieza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: r.idea, areaFinal: r.areaFinal, cliente: r.cliente, resultado: r.resultado, dolor: r.dolor }),
      signal: control.signal,
    });
    if (!res.ok) return null;
    const datos = (await res.json()) as { frase?: string; prueba?: string };
    if (!datos.frase || !datos.prueba || !r.idea || !r.areaFinal) return null;
    return {
      titulo: 'Tu frase de negocio',
      frase: datos.frase,
      idea: r.idea,
      area: r.areaFinal,
      prueba: datos.prueba,
      creadaEn: new Date().toISOString(),
      conIA: true,
    };
  } catch {
    // Sin conexión, tiempo agotado o servicio no configurado: se arma con las respuestas.
    return null;
  } finally {
    window.clearTimeout(corte);
  }
}

/** Pieza base del área (respaldo provisional: se afina en la primera sesión). */
export function piezaBase(r: Respuestas): PrimeraPieza {
  const area = r.areaFinal ?? 'servicios';
  const op = OPCIONES_EJERCICIO[area];
  const completas = { idea: r.idea || IDEAS_SUGERIDAS[area][0], cliente: r.cliente || op.cliente[0], resultado: r.resultado || op.resultado[0], dolor: r.dolor || op.dolor[0] };
  return {
    titulo: 'Tu frase de negocio (versión base)',
    frase: armarFrase(completas),
    idea: completas.idea,
    area,
    prueba: 'Es una versión base: la afinamos mañana en tu Día 2.',
    creadaEn: new Date().toISOString(),
  };
}

/* ── Persistencia (localStorage versionado; nunca bloquea si el navegador lo niega) ── */

export const CLAVE_ESTADO = 'empresai_onboarding';

export function leerEstado(): EstadoOnboarding | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE_ESTADO);
    if (!crudo) return null;
    const datos = JSON.parse(crudo) as EstadoOnboarding;
    return datos?.v === 1 && typeof datos.paso === 'string' ? datos : null;
  } catch {
    return null;
  }
}

export function guardarEstado(estado: EstadoOnboarding): void {
  try {
    window.localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
  } catch {
    // Navegación privada o almacenamiento lleno: el recorrido sigue funcionando en memoria.
  }
}

export function esPlan(valor: unknown): valor is Plan {
  return valor === 'anual' || valor === 'mensual';
}
