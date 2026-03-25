/**
 * Calcula los puntos de un usuario para una jornada.
 * Reglas:
 *   20 pts → 1 simple acertado
 *   50 pts → 2 simples acertados
 *  100 pts → 2 simples + partido de jornada acertados
 *   (el partido de jornada solo no puntúa)
 *
 * @param {Array} partidos  - [{id, tipo: 'simple'|'jornada', resultado: '1'|'X'|'2'}]
 * @param {Object} pronosticos - { [partido_id]: '1'|'X'|'2' }
 * @returns {number}
 */
export function calcularPuntuacion(partidos, pronosticos) {
  const simples = partidos.filter((p) => p.tipo === 'simple');
  const jornadaPartido = partidos.find((p) => p.tipo === 'jornada');

  const simplesAcertados = simples.filter(
    (p) => p.resultado && pronosticos[p.id] === p.resultado
  ).length;

  const jornadaAcertada =
    jornadaPartido?.resultado &&
    pronosticos[jornadaPartido.id] === jornadaPartido.resultado;

  if (simplesAcertados === 2 && jornadaAcertada) return 100;
  if (simplesAcertados === 2) return 50;
  if (simplesAcertados === 1) return 20;
  return 0;
}
