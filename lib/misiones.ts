// Misiones guiadas (nivel intermedio-fácil, como la misión 1): 2-3 preguntas con opciones del área
// + "Otra cosa (escribe la tuya)", y la pieza se compone con las respuestas y las piezas anteriores.
// Días 2-4 funcionan ya sin IA. Del día 5 en adelante la pieza la arma la IA (Sesión 6): mientras
// tanto la misión lo dice con honestidad y no inventa un resultado.

import type { DetallePieza, PiezaGuardada } from './cuenta';
import type { IdArea, Respuestas } from './onboarding';

export interface ContextoMision {
  area: IdArea;
  respuestas: Respuestas;
  piezas: PiezaGuardada[];
}

export interface PreguntaMision {
  id: string;
  pregunta: string;
  /** Palabras de la pregunta que van en dorado (1-3, deben existir literal). */
  acento: string;
  consejo: string;
  opciones: (c: ContextoMision) => string[];
  /** Varias respuestas (se confirman con un botón). */
  multiple?: boolean;
}

export interface PiezaCompuesta {
  contenido: string;
  resumen?: string;
  detalle?: DetallePieza[];
}

export interface MisionGuiada {
  dia: number;
  preguntas: PreguntaMision[];
  componer: (resp: Record<string, string[]>, c: ContextoMision) => PiezaCompuesta;
}

const porArea = (mapa: Record<IdArea, string[]>) => (c: ContextoMision) => mapa[c.area];
const minuscula = (t: string) => (t.length > 1 && t[1] === t[1].toLowerCase() ? t[0].toLowerCase() + t.slice(1) : t);
const mayuscula = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t);
const lista = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

export const MISIONES_GUIADAS: MisionGuiada[] = [
  {
    dia: 2,
    preguntas: [
      {
        id: 'edad',
        pregunta: '¿Qué edad tiene, más o menos?',
        acento: 'edad',
        consejo: 'No es para dejar a nadie fuera: es para saber cómo hablarle.',
        opciones: () => ['De 20 a 30 años', 'De 30 a 45 años', 'De 45 a 60 años', 'Cualquier edad'],
      },
      {
        id: 'dolor',
        pregunta: '¿Qué le quita el sueño?',
        acento: 'quita el sueño',
        consejo: 'El problema que ya le duele hoy, no uno que tú imaginas.',
        opciones: porArea({
          servicios: ['No le llegan clientes nuevos', 'No sabe cuánto gana de verdad', 'Se le va el día en tareas repetidas', 'Su negocio se ve poco profesional'],
          cursos: ['Siente que se está quedando atrás', 'No tiene tiempo para aprender', 'Ya pagó cursos y no los terminó', 'No sabe por dónde empezar'],
          productos: ['No encuentra algo que le guste de verdad', 'Lo que hay es caro o de mala calidad', 'No tiene tiempo de buscar', 'Quiere algo especial para regalar'],
        }),
      },
      {
        id: 'redes',
        pregunta: '¿Dónde pasa su tiempo en internet?',
        acento: 'en internet',
        consejo: 'Ahí lo vas a buscar en la semana 4. Elige todas las que apliquen.',
        opciones: () => ['Instagram', 'TikTok', 'Facebook', 'WhatsApp', 'YouTube', 'LinkedIn'],
        multiple: true,
      },
    ],
    componer: (r, c) => {
      const cliente = mayuscula(c.respuestas.cliente ?? 'Tu cliente');
      const edad = r.edad[0] === 'Cualquier edad' ? '' : `, ${minuscula(r.edad[0])}`;
      return {
        resumen: `${cliente}${edad}`,
        contenido: `${cliente}${edad}. Su mayor dolor: ${minuscula(r.dolor[0])}. Su meta: ${c.respuestas.resultado ?? 'avanzar'}. Canales: ${lista(r.redes)}.`,
        detalle: [{ rotulo: 'Úsalo así', valor: 'Antes de escribir cualquier cosa para vender, léelo y pregúntate: ¿esto le habla a esta persona?' }],
      };
    },
  },
  {
    dia: 3,
    preguntas: [
      {
        id: 'formato',
        pregunta: '¿Cómo lo vas a entregar?',
        acento: 'entregar',
        consejo: 'El formato más simple que resuelva el problema. Puedes crecer después.',
        opciones: porArea({
          servicios: ['Una sesión 1 a 1', 'Un paquete mensual', 'Un servicio llave en mano', 'Una revisión rápida'],
          cursos: ['Un mini curso en video', 'Un e-book práctico', 'Un taller en vivo', 'Una mentoría en grupo'],
          productos: ['Un producto individual', 'Un kit o combo', 'Una suscripción mensual', 'Una edición limitada'],
        }),
      },
      {
        id: 'tiempo',
        pregunta: '¿En cuánto tiempo ve el resultado?',
        acento: 'el resultado',
        consejo: 'Mientras más rápido el primer resultado, más fácil decir que sí.',
        opciones: () => ['En 1 día', 'En 7 días', 'En 30 días', 'Desde la primera vez que lo usa'],
      },
      {
        id: 'incluye',
        pregunta: '¿Qué incluye para que sea fácil?',
        acento: 'fácil',
        consejo: 'Algo que le ahorre trabajo y que la competencia no dé.',
        opciones: () => ['Una plantilla lista para usar', 'Ayuda por WhatsApp', 'Una guía paso a paso', 'Una sesión de dudas'],
      },
    ],
    componer: (r, c) => ({
      resumen: `${mayuscula(minuscula(r.formato[0]))}, ${minuscula(r.tiempo[0])}`,
      contenido: `${mayuscula(minuscula(r.formato[0]))} para ${c.respuestas.cliente ?? 'tu cliente'} que quieren ${c.respuestas.resultado ?? 'avanzar'}, ${minuscula(r.tiempo[0])}. Incluye ${minuscula(r.incluye[0])}.`,
      detalle: [{ rotulo: 'Úsalo así', valor: 'Es lo que respondes cuando alguien te pregunta "¿y qué vendes?". Dilo tal cual.' }],
    }),
  },
  {
    dia: 4,
    preguntas: [
      {
        id: 'precio',
        pregunta: '¿Con qué precio arrancas?',
        acento: 'precio',
        consejo: 'Accesible para tus primeros 10 clientes; lo subes cuando tengas pruebas.',
        opciones: porArea({
          servicios: ['$29 · para conseguir tus primeros clientes', '$79 · precio medio del mercado', '$149 · servicio premium'],
          cursos: ['$9 · precio de entrada', '$19 · precio de lanzamiento', '$47 · precio completo'],
          productos: ['$15 · precio de entrada', '$29 · precio medio', '$49 · precio premium'],
        }),
      },
      {
        id: 'pago',
        pregunta: '¿Cómo te pagan?',
        acento: 'pagan',
        consejo: 'Pago único es lo más simple para empezar.',
        opciones: () => ['Pago único', 'Pago mensual', 'En 2 o 3 cuotas'],
      },
      {
        id: 'subida',
        pregunta: '¿Cuándo lo subes?',
        acento: 'lo subes',
        consejo: 'Avisar que el precio sube es una razón honesta para comprar hoy.',
        opciones: () => ['Tras los primeros 10 clientes', 'Al terminar el lanzamiento', 'En 30 días'],
      },
    ],
    componer: (r) => {
      const monto = r.precio[0].split('·')[0].trim();
      return {
        resumen: `${monto}, ${minuscula(r.pago[0])}`,
        contenido: `${monto}, ${minuscula(r.pago[0])}, como precio de lanzamiento. Lo subes ${minuscula(r.subida[0])}.`,
        detalle: [{ rotulo: 'Úsalo así', valor: 'Este precio lo usa la misión del día 5 para compararte con tu competencia.' }],
      };
    },
  },
];

export function misionGuiada(dia: number): MisionGuiada | undefined {
  return MISIONES_GUIADAS.find((m) => m.dia === dia);
}
