import type { Locale, Localized } from "../i18n";

interface SkillSource {
  id: string;
  name: string | Localized<string>;
  category: Localized<string>;
  /** A single string (use \n for line breaks) or an array of paragraphs. */
  description: Localized<string | string[]>;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | string[];
}

const sources: SkillSource[] = [
  {
    id: "csharp",
    name: "C#",
    category: { en: "Programming", cs: "Programování" },
    description: {
      en: "My primary programming language — gameplay systems, editor tooling, and backend work.",
      cs: "Můj hlavní programovací jazyk — herní systémy, nástroje pro editor a backend.",
    },
  },
  {
    id: "ai-coding",
    name: { en: "AI-Assisted Coding", cs: "Programování s AI" },
    category: { en: "Programming", cs: "Programování" },
    description: {
      en: [
        "Building software with AI coding agents and the harnesses around them.",
        "Delegating implementation, reviewing and verifying the output, and setting up the tooling, hooks and workflows that keep agents on track.",
      ],
      cs: [
        "Vývoj softwaru s AI programovacími agenty a prostředími (harnessy), ve kterých běží.",
        "Delegování implementace, revize a ověřování výstupu a nastavení nástrojů, hooků a pracovních postupů, které agenty drží na správné cestě.",
      ],
    },
  },
  {
    id: "unity",
    name: "Unity",
    category: { en: "Game Engine", cs: "Herní engine" },
    description: {
      en: "Engine I use to build games, interactive 3D experiences, and custom tools.",
      cs: "Engine, ve kterém tvořím hry, interaktivní 3D zážitky a vlastní nástroje.",
    },
  },
  {
    id: "trisgine",
    name: "Trisgine",
    category: { en: "Game Engine", cs: "Herní engine" },
    description: {
      en: "Trisgram's in-house engine and editor.",
      cs: "Vlastní engine a editor studia Trisgram.",
    },
  },
  {
    id: "blender",
    name: "Blender",
    category: { en: "3D", cs: "3D" },
    description: {
      en: "Modeling, texturing, and animation for game-ready assets and renders.",
      cs: "Modelování, texturování a animace herních assetů a renderů.",
    },
  },
  {
    id: "substance-painter",
    name: "Substance Painter",
    category: { en: "Texturing", cs: "Texturování" },
    description: {
      en: "Physically-based texturing and material authoring for 3D models.",
      cs: "Fyzikálně založené (PBR) texturování a tvorba materiálů pro 3D modely.",
    },
  },
  {
    id: "fusion",
    name: "Fusion",
    category: { en: "CAD", cs: "CAD" },
    description: {
      en: "Parametric CAD modeling for mechanical design and 3D-printable parts.",
      cs: "Parametrické CAD modelování pro strojní konstrukci a díly pro 3D tisk.",
    },
  },
  {
    id: "3d-printing",
    name: { en: "3D Printing", cs: "3D tisk" },
    category: { en: "Fabrication", cs: "Výroba" },
    description: {
      en: [
        "FDM printing — turning CAD models into physical parts.",
        "Comfortable across the full pipeline: slicing, supports, tuning, and post-processing.",
        "Experienced in assembling and maintaining printers, and printing in materials from standard filaments to advanced engineering ones such as PA11-CF and TPU.",
      ],
      cs: [
        "FDM tisk — z CAD modelů dělám fyzické díly.",
        "Zvládám celý proces: slicování, podpěry, ladění i povrchovou úpravu.",
        "Mám zkušenosti se sestavováním a údržbou tiskáren a s tiskem z materiálů od běžných filamentů po pokročilé technické, jako je PA11-CF nebo TPU.",
      ],
    },
  },
  {
    id: "drone-pilot",
    name: { en: "Drone Pilot", cs: "Pilot dronů" },
    category: { en: "Aerial", cs: "Letecké" },
    description: {
      en: "Certified drone pilot — aerial photography, videography, and search and rescue.",
      cs: "Certifikovaný pilot dronů — letecké foto, video a pátrací a záchranné akce.",
    },
  },
];

export const skillsFor = (locale: Locale): Skill[] =>
  sources.map(({ id, name, category, description }) => ({
    id,
    name: typeof name === "string" ? name : name[locale],
    category: category[locale],
    description: description[locale],
  }));

export const skillById = (id: string, locale: Locale) =>
  skillsFor(locale).find((s) => s.id === id);
