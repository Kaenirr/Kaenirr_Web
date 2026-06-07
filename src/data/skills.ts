export interface Skill {
  id: string;
  name: string;
  category: string;
  /** A single string (use \n for line breaks) or an array of paragraphs. */
  description: string | string[];
}

export const skills: Skill[] = [
  {
    id: "csharp",
    name: "C#",
    category: "Programming",
    description:
      "My primary programming language — gameplay systems, editor tooling, and backend work.",
  },
  {
    id: "unity",
    name: "Unity",
    category: "Game Engine",
    description:
      "Engine I use to build games, interactive 3D experiences, and custom tools.",
  },
  {
    id: "blender",
    name: "Blender",
    category: "3D",
    description:
      "Modeling, texturing, and animation for game-ready assets and renders.",
  },
  {
    id: "substance-painter",
    name: "Substance Painter",
    category: "Texturing",
    description:
      "Physically-based texturing and material authoring for 3D models.",
  },
  {
    id: "fusion",
    name: "Fusion",
    category: "CAD",
    description:
      "Parametric CAD modeling for mechanical design and 3D-printable parts.",
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    category: "Fabrication",
    description: [
      "FDM printing — turning CAD models into physical parts.",
      "Comfortable across the full pipeline: slicing, supports, tuning, and post-processing.",
      "Experienced in assembling and maintaining printers, and printing in materials from standard filaments to advanced engineering ones such as PA11-CF and TPU.",
    ],
  },
  {
    id: "drone-pilot",
    name: "Drone Pilot",
    category: "Aerial",
    description:
      "Certified drone pilot — aerial photography, videography, and search and rescue.",
  },
];

export const skillById = (id: string) => skills.find((s) => s.id === id);
