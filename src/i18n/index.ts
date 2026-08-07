import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./locales/es.json";
import eu from "./locales/eu.json";
import gl from "./locales/gl.json";
import ca from "./locales/ca.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      eu: { translation: eu },
      gl: { translation: gl },
      ca: { translation: ca },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "eu", "gl", "ca"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
