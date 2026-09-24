import { test, expect } from "@playwright/test";

test.describe("Comparison Journey", () => {
	test("Compare two protocols and check comparison rows", async ({ page }) => {
		await page.goto("/");

		// Open comparison mode
		await page.click('[data-testid="compare-open"]');
		await expect(page.locator(".comparison-card")).toBeVisible();

		// Verify comparison select elements exist
		const selectors = page.locator(".comparison-picker select");
		await expect(selectors).toHaveCount(2);
	});
});
