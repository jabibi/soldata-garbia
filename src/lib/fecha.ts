/**
 * Formatea fecha y hora sin depender del orden por defecto de Intl para
 * cada configuración regional: en euskera el orden formal es año/mes/día
 * (ISO 8601); en español, día/mes/año.
 */
export function formatearFechaHora(fecha: Date, idioma: string): string {
  const dd = String(fecha.getDate()).padStart(2, "0");
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getFullYear();
  const hh = String(fecha.getHours()).padStart(2, "0");
  const min = String(fecha.getMinutes()).padStart(2, "0");

  const partesFecha = idioma?.startsWith("eu") ? `${yyyy}/${mm}/${dd}` : `${dd}/${mm}/${yyyy}`;
  return `${partesFecha} - ${hh}:${min}`;
}
