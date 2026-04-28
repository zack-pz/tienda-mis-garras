import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run dev -- --port 4173', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}'
});
