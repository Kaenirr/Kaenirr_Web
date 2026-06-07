export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
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
      "Engine I use to build interactive games, 3D experiences, prototypes, and custom tools.",
  },
  {
    id: "blender",
    name: "Blender",
    category: "3D",
    description:
      "Modeling, texturing and animation for game-ready assets and renders.",
  },
  {
    id: "substance-painter",
    name: "Substance Painter",
    category: "Texturing",
    description:
      "Physically-based texturing for 3D models.",
  },
  {
    id: "fusion",
    name: "Fusion",
    category: "CAD",
    description:
      "Parametric CAD modeling for mechanical design and 3D-printable parts.",
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
