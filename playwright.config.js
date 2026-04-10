// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test', // התיקייה שבה שמנו את קובץ הבדיקות
  use: {
    // הכתובת של השרת המקומי שה-Action יקים
    baseURL: 'http://127.0.0.1:4000', 
    headless: true, // מריץ את הדפדפן ברקע בלי חלון גרפי כדי לחסוך זמן
  },
  webServer: {
    // פקודה שמפעילה שרת סטטי על התיקייה שג'קיל בנה (_site)
    command: 'npx serve -p 4000 _site', 
    url: 'http://127.0.0.1:4000',
    reuseExistingServer: !process.env.CI,
  },
});
