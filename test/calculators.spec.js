const { test, expect } = require('@playwright/test');

// מושך את כתובת השרת מתוך קובץ ה-Action, או משתמש בברירת מחדל של 4000
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4000';

test.describe('Global Calc Hub - Core Calculators Logic Tests', () => {

  // ----------------------------------------------------
  // בדיקה 1: מחשבון ריבית דריבית (Compound Interest)
  // ----------------------------------------------------
  test('Compound Interest Calculator calculates correct future value', async ({ page }) => {
    
    // ניווט לעמוד
    await page.goto(`${baseURL}/compound-interest/`);

    // מציאת השדות וניקוי ערכי ברירת המחדל לפני ההקלדה
    const principalInput = page.locator('#p');
    const rateInput = page.locator('#r');
    const timeInput = page.locator('#t');

    await principalInput.fill('');
    await principalInput.type('10000'); // סכום התחלתי

    await rateInput.fill('');
    await rateInput.type('7'); // אחוז ריבית שנתית

    await timeInput.fill('');
    await timeInput.type('10'); // כמות שנים

    // לחיצה על כפתור החישוב
    await page.click('button:has-text("Calculate")');

    // וידוא שהתוצאה המוצגת היא בדיוק לפי הנוסחה המתמטית
    // 10000 * (1 + 0.07)^10 = $19,671.51
    await expect(page.locator('#res-interest-val')).toHaveText('$19,671.51');
    
    // וידוא ששורת הרווח מתעדכנת בהתאם
    await expect(page.locator('#res-interest-gain')).toHaveText('+$9,672 in profit');
  });

  // ----------------------------------------------------
  // בדיקה 2: מחשבון אחוזים (Percentage Calculator)
  // ----------------------------------------------------
  test('Percentage Calculator finds the correct percentage of a total', async ({ page }) => {
    
    await page.goto(`${baseURL}/percentage/`);

    // הקלדת הנתונים לבדיקה: כמה זה 15% מתוך 500?
    const percentValInput = page.locator('#perc-val');
    const percentTotalInput = page.locator('#perc-total');

    await percentValInput.fill('');
    await percentValInput.type('15');

    await percentTotalInput.fill('');
    await percentTotalInput.type('500');

    await page.click('button:has-text("Calculate")');

    // 15% of 500 = 75
    await expect(page.locator('#res-percent-val')).toHaveText('75');
  });

  // ----------------------------------------------------
  // בדיקה 3: ממיר יחידות (Unit Converter)
  // ----------------------------------------------------
  test('Unit Converter instantly converts Kilograms to Pounds', async ({ page }) => {
    
    await page.goto(`${baseURL}/unit-converter/`);

    // נוודא ששדה הבחירה (Select) מוגדר על 'weight'
    await page.selectOption('#unit-type', 'weight');

    // הקלדה בשדה של הקילוגרמים (החישוב מתבצע אוטומטית בהקלדה, אין כפתור Calculate)
    const kgInput = page.locator('#input-1');
    await kgInput.fill('');
    await kgInput.type('1'); // 1 קילוגרם

    // השדה השני (LBS) אמור להתעדכן מיד ל-2.20
    const lbsInput = page.locator('#input-2');
    await expect(lbsInput).toHaveValue('2.20');
  });

});
