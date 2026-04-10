// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test',
  use: {
    // הכתובת של השרת
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4000',
    screenshot: 'only-on-failure',
  },
  webServer: {
    // הפקודה להפעלת השרת - Playwright יריץ אותה אוטומטית
    command: 'npx serve -p 4000 _site',
    url: 'http://127.0.0.1:4000',
    reuseExistingServer: !process.env.CI, // ב-GitHub (CI) הוא יפעיל מחדש, במחשב שלך הוא ישתמש בקיים
    timeout: 120 * 1000,
  },
});
