const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

//"domingo, 18 de octubre, 6:00 p. m." en hora de Colombia (UTC-5, sin horario de verano)
//se arma a mano porque Intl escribe el espacio de "p. m." distinto en Node y en el navegador
export function formatEventDate(iso: string) {
  const date = new Date(new Date(iso).getTime() - 5 * 3_600_000);
  const hours = date.getUTCHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const suffix = hours < 12 ? "a. m." : "p. m.";

  return `${DAYS[date.getUTCDay()]}, ${date.getUTCDate()} de ${MONTHS[date.getUTCMonth()]}, ${hour12}:${minutes} ${suffix}`;
}