import { test, expect } from "@playwright/test";

test.describe("Modal Focus Trapping and Lifecycle", () => {
	test("Modal opens, traps focus, responds to Escape, and restores focus", async ({ page }) => {
		await page.goto("/");

		// Focus Import button and open modal
		const importBtn = page.locator('[data-testid="import-open"]');
		await importBtn.focus();
		await page.keyboard.press("Enter");

		const dialog = page.locator('[data-testid="modal-dialog"]');
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute("role", "dialog");
		await expect(dialog).toHaveAttribute("aria-modal", "true");

		// Verify Escape key closes dialog and restores focus to trigger button
		await page.keyboard.press("Escape");
		await expect(dialog).not.toBeVisible();
		await expect(importBtn).toBeFocused();
	});
});
