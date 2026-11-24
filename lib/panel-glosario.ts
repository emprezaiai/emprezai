// Glosario del panel: qué significa cada número técnico, cómo se calcula (la MISMA cuenta que hace
// lib/servidor/panel.ts) y qué valor es sano. Se abre con el ⓘ junto a cada métrica. Lenguaje simple:
// la dueña no tiene por qué saber qué es MRR o churn; el nombre en inglés va solo como referencia.

export interface Definicion {
  titulo: string;
  que: string;
  como: string;
  sano?: string;
}

export const GLOSARIO = {
  ganancia: {
    titulo: 'Te quedaron limpios',
    que: 'Lo que de verdad es tuyo después de pagar todo lo que cuesta vender y mantener la app.',
    como: 'Facturaste − devoluciones − comisión de Hotmart − afiliados − impuestos − IA − costos fijos.',
    sano: 'Que sea positivo y crezca mes a mes.',
  },
  margen: {
    titulo: 'Margen',
    que: 'De cada $100 que facturas, cuántos te quedan limpios.',
    como: 'Te quedaron limpios ÷ facturaste.',
    sano: 'En apps por suscripción, más de 50% es muy sano; menos de 20% pide revisar costos.',
  },
  facturado: {
    titulo: 'Lo que entró',
    que: 'Todo lo que cobró Hotmart en el mes, antes de descontar nada.',
    como: 'Suma de los cobros aprobados del mes, en dólares. Las otras monedas van aparte.',
  },
  conAcceso: {
    titulo: 'Con acceso hoy',
    que: 'Personas que hoy pueden entrar a la app porque pagan o están en su prueba gratis.',
    como: 'Clientes pagando + clientes en prueba. No incluye a quienes les regalaste acceso.',
  },
  suscripciones: {
    titulo: 'Suscripciones al mes',
    que: 'Lo que te entraría cada mes si nadie cancela. En inglés le dicen MRR.',
    como: 'Clientes del plan mensual × $9,99 + clientes del plan anual × $79,99 ÷ 12.',
    sano: 'Que suba mes a mes: es el número que mejor dice si el negocio crece.',
  },
  seFueron: {
    titulo: 'Se fueron',
    que: 'De cada 100 clientes que pagaban al empezar el mes, cuántos dejaron de pagar. En inglés le dicen churn.',
    como: '(Los que cancelaron + los que se perdieron por pago fallido) ÷ los que pagaban el día 1 del mes.',
    sano: 'Menos de 5% al mes es muy bueno. Más de 8% es una alarma: revisa por qué se van.',
  },
  gastoIa: {
    titulo: 'Gasto en IA',
    que: 'Lo que pagaste a la IA por cada pieza y opción que armó en la app.',
    como: 'Suma del costo real de cada uso, registrado en el momento en que la IA respondió.',
    sano: 'Menos del 20% de lo que facturas.',
  },
  iaPorcentaje: {
    titulo: 'De lo que facturas, se va en IA',
    que: 'Qué parte de tus ventas se come el costo de la IA.',
    como: 'Gasto en IA del mes ÷ lo que facturaste en el mes.',
    sano: 'Por debajo de 20%. Si pasa, mira qué función gasta más.',
  },
  iaPorCliente: {
    titulo: 'IA por cliente',
    que: 'Lo que cuesta en promedio la IA de cada cliente que la usó.',
    como: 'Gasto en IA de clientes (sin la pieza gratis) ÷ clientes que la usaron.',
    sano: 'Que sea una parte chica de lo que paga cada cliente al mes.',
  },
  topesIa: {
    titulo: 'Topes de gasto',
    que: 'Un freno automático para que la IA nunca gaste de más, aunque alguien abuse.',
    como: 'Al llegar al tope del día o del mes, la IA se pausa sola y las piezas se arman con las respuestas, sin IA.',
  },
  conversionPrueba: {
    titulo: 'Pruebas que pagaron',
    que: 'De las pruebas gratis que ya terminaron, cuántas pasaron a pagar.',
    como: 'Pruebas que pasaron a pago ÷ (las que pasaron + las que terminaron sin pagar).',
    sano: '40% o más es muy bueno. Con menos de 10 pruebas terminadas, el número todavía cambia mucho.',
  },
  ltv: {
    titulo: 'Lo que deja un cliente',
    que: 'Lo que te paga un cliente en promedio durante todo el tiempo que se queda. En inglés le dicen LTV.',
    como: 'Lo que paga por mes (ya sin la comisión de Hotmart) × los meses que se queda. Los meses salen de cuántos se van: si se va el 10% al mes, se quedan unos 10 meses (máximo 24).',
    sano: 'Al menos 3 veces lo que te cuesta conseguir un cliente.',
  },
  cac: {
    titulo: 'Costo por cliente',
    que: 'Cuánto gastas en anuncios para conseguir un cliente nuevo. En inglés le dicen CAC.',
    como: 'Lo que gastaste en anuncios ÷ clientes nuevos que llegaron por esos anuncios.',
    sano: 'Menos de un tercio de lo que deja un cliente.',
  },
  retornoCanal: {
    titulo: 'Si un canal te deja dinero',
    que: 'Compara lo que gastaste en un canal con lo que te dejarán los clientes que trajo.',
    como: 'Clientes del canal que siguen × lo que deja un cliente, contra lo que gastaste en ese canal.',
    sano: 'Que cada $1 que gastas vuelva como $3 o más. Entre $1 y $3 se paga, pero justo.',
  },
  activosHoy: {
    titulo: 'Activos hoy',
    que: 'Personas que armaron al menos una pieza hoy dentro de la app.',
    como: 'Personas distintas con una pieza guardada hoy. Igual para la semana y el mes.',
  },
  activacion: {
    titulo: 'Activación',
    que: 'Cuántos llegan a la segunda pieza en su primera semana: la señal de que la app ya les sirvió.',
    como: 'Personas que armaron su pieza 2 dentro de sus primeros 7 días ÷ personas que ya cumplieron su primera semana.',
    sano: '50% o más.',
  },
  fantasmas: {
    titulo: 'Pagan y no entran',
    que: 'Clientes que pagan pero no armaron ninguna pieza en los últimos 14 días.',
    como: 'Clientes que pagaron hace más de 14 días, siguen con acceso y no guardaron ninguna pieza en esos 14 días.',
    sano: 'Cero. Son los que más cancelan: escríbeles para que vuelvan antes de que se vayan.',
  },
  dia30: {
    titulo: 'Terminaron la ruta',
    que: 'Personas que completaron la ruta de 30 días.',
    como: 'Personas cuya pieza más avanzada es del día 30 o más.',
  },
  retencion: {
    titulo: '¿Vuelven?',
    que: 'De quienes empezaron hace al menos 1, 7 o 30 días, cuántos volvieron a armar una pieza ese día exacto.',
    como: 'Personas con pieza el día 1 (o 7, o 30) después de su primera pieza ÷ personas que ya llegaron a ese día.',
    sano: 'En apps de hábito: 40% al día siguiente, 20% a la semana y 10% al mes ya es sano.',
  },
  camino: {
    titulo: 'El camino de venta',
    que: 'Cuántas personas distintas llegan a cada paso, desde que ven tu página hasta que pagan.',
    como: 'Personas distintas por paso en el mes elegido, sin contar tus visitas de prueba. El % es cuántos siguen respecto al paso anterior.',
    sano: 'Lo que importa es dónde se pierde más gente: esa pantalla es la que conviene mejorar primero.',
  },
  comisionHotmart: {
    titulo: 'Comisión de Hotmart',
    que: 'Lo que Hotmart se queda por cada venta.',
    como: 'Si Hotmart manda el detalle, es el número real. Si no, se estima en 9,9% + $0,45 por venta.',
  },
  impuestos: {
    titulo: 'Impuestos',
    que: 'Lo que calculas que pagarás de impuestos por tus ventas.',
    como: 'Lo facturado (sin devoluciones) × el porcentaje que pusiste en Ajustes. Es un estimado: confírmalo con tu contador.',
  },
} satisfies Record<string, Definicion>;

export type ClaveGlosario = keyof typeof GLOSARIO;
