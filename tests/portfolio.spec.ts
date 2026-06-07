import { test, expect } from "@playwright/test";

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

test("skills page lists all skills and filters via search", async ({ page }) => {
  await page.goto("/skills");
  const cards = page.locator("#skill-grid .skill");
  await expect(cards).toHaveCount(6);

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
  await page.locator(".tags [data-skill='unity']").first().click();
  const toast = page.locator("#skill-toast");
  await expect(toast).toBeVisible();
  await expect(toast.locator(".name")).toHaveText("Unity");
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
