import type { ui } from "./i18n";

export interface NavItem {
  key: keyof (typeof ui)["en"]["nav"];
  href: string;
}

export const navItems: NavItem[] = [
  { key: "skills", href: "/skills" },
  { key: "experience", href: "/experience" },
  { key: "projects", href: "/projects" },
  { key: "contact", href: "/contact" },
];

export const siteName = "Kaenirr";
