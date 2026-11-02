import { test, expect } from "@playwright/test";
import { formatDuration } from "../src/lib/duration";

const pages = [
  { href: "/skills", heading: "Skills" },
  { href: "/experience", heading: "Experience" },
  { href: "/projects", heading: "Projects" },
  { href: "/contact", heading: "Contact" },
];

test("home renders four section buttons", async ({ page }) => {
  await page.goto("/");
  const buttons = page.locator("nav[aria-label='Sections'] a");
  await expect(buttons).toHaveCount(4);
});

for (const { href, heading } of pages) {
  test(`nav button opens ${heading}`, async ({ page }) => {
    await page.goto("/");
    await page.locator(`nav[aria-label='Sections'] a[href='${href}']`).click();
    await expect(page).toHaveURL(new RegExp(`${href}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  });
}

test("brand link returns home from a subpage", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: "Kaenirr" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("experience renders a timeline sorted newest-first", async ({ page }) => {
  await page.goto("/experience");
  const entries = page.locator(".timeline .entry");
  await expect(entries.first()).toBeVisible();

  const startYears = await entries
    .locator(".period")
    .evaluateAll((nodes) =>
      nodes.map((n) => Number(n.textContent!.match(/\d{4}/)![0])),
    );
  const descending = [...startYears].sort((a, b) => b - a);
  expect(startYears).toEqual(descending);
});

test("ongoing role duration is recomputed in the browser, not frozen at build", async ({
  page,
}) => {
  await page.goto("/experience");
  const live = page.locator(".duration[data-ongoing-since]").first();
  const start = await live.getAttribute("data-ongoing-since");
  await expect(live).toHaveText(`· ${formatDuration(start!, null)}`);
});

test("avatar is served as an optimized build asset, not the raw favicon", async ({
  page,
}) => {
  await page.goto("/");
  const img = page.locator(".avatar img");
  expect(await img.getAttribute("src")).toMatch(/\/_astro\//);
  expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator(".avatar source[type='image/avif']")).toHaveCount(1);
});

test("favicon link resolves to a real asset", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator("link[rel='icon']").getAttribute("href");
  expect((await request.get(href!)).status()).toBe(200);
});

test("tilt tracks the cursor and promotes the card only while hovered", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("nav[aria-label='Sections'] a").first();
  const inlineStyle = () => card.evaluate((el: HTMLElement) => el.style.cssText);

  await card.hover();
  await expect.poll(inlineStyle).toContain("--mx");
  expect(await inlineStyle()).toContain("will-change");

  await page.mouse.move(0, 0);
  await expect.poll(inlineStyle).not.toContain("will-change");
});

test("skills page lists all skills and filters via search", async ({ page }) => {
  await page.goto("/skills");
  const cards = page.locator("#skill-grid .skill");
  await expect(cards).toHaveCount(9);

  await page.locator("#skill-search").fill("blend");
  await expect(cards.filter({ hasText: "Blender" })).toBeVisible();
  await expect(page.locator("#skill-grid .skill:visible")).toHaveCount(1);

  await page.locator("#skill-search").fill("zzz");
  await expect(page.locator("#skill-empty")).toBeVisible();
});

test("clicking a skill opens the toast without navigating", async ({ page }) => {
  await page.goto("/skills");
  await page.locator("[data-skill='unity']").first().click();
  const toast = page.locator("#skill-toast");
  await expect(toast).toBeVisible();
  await expect(toast.locator(".name")).toHaveText("Unity");
  await expect(page).toHaveURL(/\/skills\/?$/);
  await page.locator("#skill-toast .close").click();
  await expect(toast).toBeHidden();
});

test("skill tag in experience opens the toast in place (no redirect)", async ({
  page,
}) => {
  await page.goto("/experience");
  await page.locator(".skills [data-skill='unity']").first().click();
  await expect(page.locator("#skill-toast")).toBeVisible();
  await expect(page).toHaveURL(/\/experience\/?$/);
});

test("skill tag in a project opens the toast without following the card link", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.locator(".tags [data-skill='ai-coding']").first().click();
  const toast = page.locator("#skill-toast");
  await expect(toast).toBeVisible();
  await expect(toast.locator(".name")).toHaveText("AI-Assisted Coding");
  await expect(page).toHaveURL(/\/projects\/?$/);
});

test("theme toggle flips, persists across reload and navigation", async ({
  page,
}) => {
  await page.goto("/");
  const html = page.locator("html");
  const initial = await html.getAttribute("data-theme");
  const expected = initial === "dark" ? "light" : "dark";

  await page.locator("#theme-toggle").click();
  await expect(html).toHaveAttribute("data-theme", expected);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", expected);

  await page.goto("/skills");
  await expect(html).toHaveAttribute("data-theme", expected);
});

test("no theme flash: data-theme present before paint", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", /light|dark/);
});

test("Czech home is served under /cs with localized text and links", async ({
  page,
}) => {
  await page.goto("/cs/");
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ahoj");
  const sections = page.locator("nav[aria-label='Sections'] a");
  await expect(sections.first()).toHaveAttribute("href", "/cs/skills");
  await expect(page.getByRole("link", { name: "Kaenirr" })).toHaveAttribute(
    "href",
    "/cs/",
  );
});

test("language toggle switches to the same page in the other language and back", async ({
  page,
}) => {
  await page.goto("/skills");
  await expect(page.locator("#lang-toggle")).toHaveText("CZ");
  await page.locator("#lang-toggle").click();
  await expect(page).toHaveURL(/\/cs\/skills\/?$/);
  await expect(page.locator("#lang-toggle")).toHaveText("EN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dovednosti");

  await page.locator("#lang-toggle").click();
  await expect(page).toHaveURL(/\/skills\/?$/);
  await expect(page).not.toHaveURL(/\/cs\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Skills");
});

test("language toggle on the home page goes between / and /cs/", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#lang-toggle").click();
  await expect(page).toHaveURL(/\/cs\/$/);
  await page.locator("#lang-toggle").click();
  await expect(page).toHaveURL(/:\d+\/$/);
});

test("skill toast shows Czech text on Czech pages", async ({ page }) => {
  await page.goto("/cs/skills");
  await page.locator("[data-skill='3d-printing']").first().click();
  const toast = page.locator("#skill-toast");
  await expect(toast.locator(".name")).toHaveText("3D tisk");
  await expect(toast.locator(".cat")).toHaveText("Výroba");
});

test("Czech ongoing role duration is recomputed with Czech units", async ({
  page,
}) => {
  await page.goto("/cs/experience");
  const live = page.locator(".duration[data-ongoing-since]").first();
  const start = await live.getAttribute("data-ongoing-since");
  await expect(live).toHaveText(`· ${formatDuration(start!, null, "cs")}`);
});

for (const path of ["/experience", "/cs/experience"]) {
  test(`header fits a phone screen without horizontal scroll (${path})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test("company name in experience links to its site in a new tab", async ({
  page,
}) => {
  await page.goto("/experience");
  const link = page.locator(".meta a", { hasText: "Trisgram" });
  await expect(link).toHaveAttribute("href", "https://trisgram.com");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
});

test("Trisgine and Drone Pilot are tagged on the Trisgram role", async ({
  page,
}) => {
  await page.goto("/experience");
  const tags = page.locator(".skills");
  await expect(tags.locator("[data-skill='drone-pilot']")).toBeVisible();
  await tags.locator("[data-skill='trisgine']").click();
  await expect(page.locator("#skill-toast .name")).toHaveText("Trisgine");
});
