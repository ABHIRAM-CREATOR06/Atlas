import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/browser",
	fullyParallel: false,
	workers: 1,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "npm run preview",
		url: "http://127.0.0.1:4173",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
});
