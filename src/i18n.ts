export const locales = ["en", "cs"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Localized<T> = Record<Locale, T>;

/** Shown on the language toggle; URLs and `lang` attributes keep the ISO language code ("cs"). */
export const localeLabels: Localized<string> = { en: "EN", cs: "CZ" };

export const toLocale = (lang: string | undefined): Locale =>
  locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;

/** Every page lives under `[...lang]`: the default locale at the root, the rest under `/<locale>`. */
export const localeStaticPaths = () =>
  locales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
  }));

export const localizePath = (path: string, locale: Locale) =>
  locale === defaultLocale ? path : `/${locale}${path}`;

const localePrefix = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

/** "/cs/skills/" → "/skills", "/cs/" → "/" */
export const unlocalizePath = (pathname: string) =>
  pathname.replace(localePrefix, "").replace(/\/$/, "") || "/";

const en = {
  nav: {
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    contact: "Contact",
  },
  switchLanguage: "Přepnout do češtiny",
  toggleTheme: "Toggle color theme",
  close: "Close",
  home: {
    greeting: "Hi, I'm",
    tagline: "I'm a 3D artist/programmer consumed by my desire to learn everything.",
    avatarAlt: "Portrait of Martin",
    blurbs: {
      skills: "Tools & tech I build with",
      experience: "Where I've worked",
      projects: "Things I've made",
      contact: "Get in touch",
    },
  },
  skills: {
    search: "Search skills…",
    searchLabel: "Search skills",
    noMatch: "No skills match",
  },
  experience: {
    present: "Present",
  },
  contact: {
    intro: "Get in touch — I'm open to collaborations and opportunities.",
    email: "Email",
  },
};

export const ui: Localized<typeof en> = {
  en,
  cs: {
    nav: {
      skills: "Dovednosti",
      experience: "Zkušenosti",
      projects: "Projekty",
      contact: "Kontakt",
    },
    switchLanguage: "Switch to English",
    toggleTheme: "Přepnout barevný motiv",
    close: "Zavřít",
    home: {
      greeting: "Ahoj, jsem",
      tagline:
        "Jsem 3D grafik a programátor, kterého pohání touha naučit se úplně všechno.",
      avatarAlt: "Portrét Martina",
      blurbs: {
        skills: "Nástroje a technologie, se kterými pracuji",
        experience: "Kde jsem pracoval",
        projects: "Co jsem vytvořil",
        contact: "Ozvěte se mi",
      },
    },
    skills: {
      search: "Hledat dovednosti…",
      searchLabel: "Hledat dovednosti",
      noMatch: "Žádná dovednost neodpovídá",
    },
    experience: {
      present: "Současnost",
    },
    contact: {
      intro: "Ozvěte se — jsem otevřený spolupráci i novým příležitostem.",
      email: "E-mail",
    },
  },
};
