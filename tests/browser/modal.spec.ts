import { test, expect } from "@playwright/test";

test.describe("Modal Focus Trapping and Lifecycle", () => {
	test("traps Tab in both directions and restores focus after close and reopen", async ({ page }) => {
		await page.goto("/");
		const trigger = page.locator('[data-testid="import-open"]');
		await trigger.focus();
		await page.keyboard.press("Enter");
		const dialog = page.locator('[data-testid="modal-dialog"]');
		const close = dialog.locator('[data-testid="modal-close"]');
		const last = dialog.locator('[data-testid="validate-trace"]');
		await expect(close).toBeFocused();
		await page.keyboard.press("Shift+Tab");
		await expect(last).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(close).toBeFocused();
		await close.click();
		await expect(trigger).toBeFocused();
		await trigger.click();
		await expect(dialog).toBeVisible();
		await expect(close).toBeFocused();
	});

	test("backdrop closes and restores focus", async ({ page }) => {
		await page.goto("/");
		const trigger = page.locator('[data-testid="import-open"]');
		await trigger.click();
		await page.locator(".dialog-backdrop").click({ position: { x: 4, y: 4 } });
		await expect(page.locator('[data-testid="modal-dialog"]')).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});

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
