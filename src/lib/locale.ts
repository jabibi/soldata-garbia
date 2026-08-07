const LOCALES_INTL: Record<string, string> = {
  es: "es-ES",
  eu: "eu-ES",
  gl: "gl-ES",
  ca: "ca-ES",
};

export function localeIntl(idioma: string): string {
  return LOCALES_INTL[idioma] ?? "es-ES";
}
