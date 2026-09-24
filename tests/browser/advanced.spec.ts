import { test, expect } from "@playwright/test";

test.describe("Advanced Protocol Journey", () => {
	test("X3DH + Double Ratchet dependency graph, compromise scenarios, and walkthrough", async ({ page }) => {
		await page.goto("/");

		// Open catalog and select X3DH / Double Ratchet protocol
		await page.click('[data-testid="catalog-open"]');
		await page.click('[data-testid="catalog-explore-x3dh-ratchet"]');

		await expect(page.locator("#protocol-title")).toContainText("X3DH");

		// Open dependency graph view
		await page.click('[data-testid="workspace-view-dependency"]');
		await expect(page.getByTestId("dependency-graph-view")).toBeVisible();

		// Activate a compromise scenario if available
		const scenarioPicker = page.locator('[data-testid="scenario-picker"]');
		if (await scenarioPicker.isVisible()) {
			await scenarioPicker.selectOption({ index: 1 });
		}

		// Open walkthrough view
		await page.click('[data-testid="workspace-view-walkthrough"]');
		await expect(page.getByTestId("guided-walkthrough-view")).toBeVisible();
	});
});
