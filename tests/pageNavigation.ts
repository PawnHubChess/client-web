import { expect, test } from "@playwright/test";

test("pageNavigation", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "The Project" }).click();
  await expect(page).toHaveURL("http://localhost:5173/");

  await page.getByRole("link", { name: "Meet the Team" }).click();
  await expect(page).toHaveURL("http://localhost:5173/team");

  await page.getByRole("link", { name: "Research" }).click();
  await expect(page).toHaveURL("http://localhost:5173/research");

  await page.getByRole("link", { name: "Connecting Cultures" }).click();
  await expect(page).toHaveURL("http://localhost:5173/art");

  await page.getByRole("button", { name: "Play Chess!" }).click();
  await expect(page).toHaveURL("http://localhost:5173/play");
});
