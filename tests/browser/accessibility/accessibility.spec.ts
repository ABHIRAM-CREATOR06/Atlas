import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Automated Accessibility Checks", () => {
	test("Initial workspace should pass Axe accessibility checks", async ({ page }) => {
		await page.goto("/");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();

		// Fail on critical/serious violations
		const severeViolations = accessibilityScanResults.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious"
		);

		expect(severeViolations).toEqual([]);
	});

	test("Catalog view should pass Axe accessibility checks", async ({ page }) => {
		await page.goto("/");
		await page.click('[data-testid="catalog-open"]');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();

		const severeViolations = accessibilityScanResults.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious"
		);

		expect(severeViolations).toEqual([]);
	});
});
