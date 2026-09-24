import { test, expect } from "@playwright/test";

test.describe("Beginner Protocol Journey", () => {
	test("TCP protocol navigation, replay, inspection, and view switching", async ({ page }) => {
		// 1. Open application
		await page.goto("/");

		// 2. Open protocol catalog
		await page.click('[data-testid="catalog-open"]');
		await expect(page.locator("#catalog-title")).toBeVisible();

		// 3. Search for TCP
		await page.fill('[data-testid="catalog-search"]', "TCP");
		await page.selectOption('[data-testid="catalog-difficulty-filter"]', "Beginner");

		// 4. Open TCP protocol
		await page.click('[data-testid="catalog-explore-tcp-3way"]');

		// 5. Confirm summary shows TCP
		await expect(page.locator("#protocol-title")).toContainText("TCP");

		// 6. Select sequence diagram
		await page.click('[data-testid="workspace-view-sequence"]');
		await expect(page.locator("svg.diagram")).toBeVisible();

		// 7. Inspect an event in sequence diagram
		const eventRow = page.locator('[data-testid^="event-row-"]').first();
		await expect(eventRow).toBeVisible();
		await eventRow.click();

		// 8. Verify inspector panel displays event details
		await expect(page.locator('[data-testid="inspector-panel"]')).toBeVisible();
		await expect(page.locator("#inspector-title")).not.toHaveText("No Event Selected");

		// 9. Switch to timeline view
		await page.click('[data-testid="workspace-view-timeline"]');
		await expect(page.getByRole("heading", { name: "Replay & state evolution" })).toBeVisible();

		// 10. Switch to state machine view
		await page.click('[data-testid="workspace-view-state-machine"]');
		await expect(page.locator("svg.state-diagram")).toBeVisible();
	});
});
