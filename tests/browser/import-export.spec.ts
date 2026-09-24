import { test, expect } from "@playwright/test";

test.describe("Import and Export Journeys", () => {
	test("Import valid trace and verify preview validation", async ({ page }) => {
		await page.goto("/");

		// Open Import modal
		await page.click('[data-testid="import-open"]');
		await expect(page.locator('[data-testid="modal-dialog"]')).toBeVisible();

		// Fill valid trace JSONL
		const validTraceJsonl = '{"id":"test_evt_1","t":0,"actor":"Client","event":"SYN","label":"SYN Request"}\n{"id":"test_evt_2","t":1,"actor":"Server","event":"SYN-ACK","label":"SYN-ACK Response"}';
		await page.fill('[data-testid="trace-input"]', validTraceJsonl);

		// Click Preview & Validate
		await page.click('[data-testid="validate-trace"]');

		// Confirm validation succeeded and Load Trace button appears
		await expect(page.locator('[data-testid="load-trace"]')).toBeVisible();

		// Load trace into workspace
		await page.click('[data-testid="load-trace"]');
		await expect(page.locator('[data-testid="modal-dialog"]')).not.toBeVisible();
	});

	test("Export sanitized trace download assertion", async ({ page }) => {
		await page.goto("/");

		// Open Export modal
		await page.click('[data-testid="export-open"]');
		await expect(page.locator('[data-testid="modal-dialog"]')).toBeVisible();

		// Download sanitized trace
		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.click('[data-testid="export-sanitized-trace"]'),
		]);

		expect(download.suggestedFilename()).toContain("sanitized_trace.jsonl");
	});
});
