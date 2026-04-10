// test/calculators.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Calculators E2E Tests', () => {

  // בדיקה 1: מחשבון ריבית דריבית
  test('Compound Interest Calculator works correctly', async ({ page }) => {
    // 1. הגולש הווירטואלי נכנס לעמוד המחשבון
    await page.goto('/compound-interest/');

    // 2. הוא מזין נתונים בשדות
    await page.fill('#p', '10000'); // סכום התחלתי
    await page.fill('#r', '7');     // ריבית
    await page.fill('#t', '10');    // שנים

    // 3. הוא לוחץ על כפתור החישוב
    await page.click('button:has-text("Calculate")');

    // 4. המערכת מוודאת שהתוצאה המתמטית שמוצגת מדויקת
    await expect(page.locator('#res-interest-val')).toHaveText('$19,671.51');
  });

  // בדיקה 2: מחשבון אחוזים
  test('Percentage Calculator works correctly', async ({ page }) => {
    await page.goto('/percentage/');

    // בודקים: כמה זה 15% מתוך 500?
    await page.fill('#perc-val', '15');
    await page.fill('#perc-total', '500');

    await page.click('button:has-text("Calculate")');

    // מוודאים שהתוצאה היא בדיוק 75
    await expect(page.locator('#res-percent-val')).toHaveText('75');
  });

  // בדיקה 3: ממיר יחידות
  test('Unit Converter works correctly (Weight)', async ({ page }) => {
    await page.goto('/unit-converter/');

    // המשתמש מקליד 1 ק"ג
    await page.fill('#input-1', '1');

    // בממיר יחידות החישוב הוא אוטומטי בעת ההקלדה.
    // נוודא ששדה הפאונדים התעדכן אוטומטית ל-2.20
    await expect(page.locator('#input-2')).toHaveValue('2.20');
  });

});
