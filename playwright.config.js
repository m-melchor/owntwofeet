// Site tests run against the built site (dist/) in the Chrome already installed on this machine.
// Run with `npm run check`, which builds first.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5630', channel: 'chrome' },
  webServer: {
    command: 'npx astro preview --port 5630',
    url: 'http://localhost:5630/owntwofeet/',
    reuseExistingServer: true, // Astro allows one preview server, so reuse the one already running
  },
});
